package com.adventure.retail.application.promotion;

import com.adventure.retail.application.exception.ConflictException;
import com.adventure.retail.application.exception.NotFoundException;
import com.adventure.retail.domain.product.Product;
import com.adventure.retail.domain.product.ProductRepository;
import com.adventure.retail.domain.promotion.Promotion;
import com.adventure.retail.domain.promotion.PromotionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PromotionService {

    private static final Set<String> VALID_TYPES = Set.of(
            Promotion.TYPE_PERCENTAGE, Promotion.TYPE_FIXED_AMOUNT,
            Promotion.TYPE_2X1, Promotion.TYPE_COMBO);

    private final PromotionRepository promotionRepository;
    private final ProductRepository productRepository;

    public PromotionService(PromotionRepository promotionRepository, ProductRepository productRepository) {
        this.promotionRepository = promotionRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<Promotion> list(String query, String type, String status) {
        LocalDate today = LocalDate.now();
        return promotionRepository.findAll().stream()
                .filter(promotion -> type == null || type.isBlank() || promotion.getType().equalsIgnoreCase(type))
                .filter(promotion -> status == null || status.isBlank()
                        || promotion.getStatus(today).equalsIgnoreCase(status))
                .filter(promotion -> query == null || query.isBlank()
                        || promotion.getName().toLowerCase(Locale.ROOT).contains(query.toLowerCase(Locale.ROOT))
                        || (promotion.getDescription() != null
                        && promotion.getDescription().toLowerCase(Locale.ROOT).contains(query.toLowerCase(Locale.ROOT))))
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<Promotion> expiringSoon(int days) {
        LocalDate today = LocalDate.now();
        return promotionRepository.findAll().stream()
                .filter(promotion -> promotion.isExpiringSoon(today, days))
                .toList();
    }

    @Transactional(readOnly = true)
    public Promotion getById(UUID id) {
        return promotionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Promoción no encontrada"));
    }

    @Transactional
    public Promotion create(PromotionRequest request) {
        validate(request);
        String name = request.name().trim();
        if (promotionRepository.existsByName(name)) {
            throw new ConflictException("Ya existe una promoción con ese nombre");
        }
        validateProducts(request.productIds());
        return promotionRepository.save(Promotion.create(
                name,
                request.description(),
                request.type(),
                request.value(),
                request.startDate(),
                request.endDate(),
                request.conditions(),
                defaultAmount(request.minimumAmount()),
                request.productIds() != null ? request.productIds() : List.of()));
    }

    @Transactional
    public Promotion update(UUID id, PromotionRequest request) {
        Promotion current = getById(id);
        validate(request);
        if (!current.getName().equalsIgnoreCase(request.name().trim())
                && promotionRepository.existsByName(request.name().trim())) {
            throw new ConflictException("Ya existe una promoción con ese nombre");
        }
        validateProducts(request.productIds());
        Promotion updated = current.withUpdatedData(
                request.name().trim(),
                request.description(),
                request.type(),
                request.value(),
                request.startDate(),
                request.endDate(),
                request.active() != null ? request.active() : current.isActive(),
                request.conditions(),
                defaultAmount(request.minimumAmount()),
                request.productIds() != null ? request.productIds() : List.of());
        return promotionRepository.save(updated);
    }

    @Transactional
    public Promotion setActive(UUID id, boolean active) {
        Promotion current = getById(id);
        return promotionRepository.save(current.withActive(active));
    }

    @Transactional
    public void delete(UUID id) {
        getById(id);
        promotionRepository.deleteById(id);
    }

    private void validate(PromotionRequest request) {
        if (!VALID_TYPES.contains(request.type())) {
            throw new ConflictException("Tipo de promoción inválido. Use: Porcentaje, Monto fijo, 2x1 o Combo");
        }
        if (request.endDate().isBefore(request.startDate())) {
            throw new ConflictException("La fecha de fin debe ser posterior a la fecha de inicio");
        }
        boolean percentage = !request.type().equals(Promotion.TYPE_FIXED_AMOUNT);
        if (percentage && request.value().compareTo(BigDecimal.valueOf(100)) > 0) {
            throw new ConflictException("El descuento no puede superar el 100%");
        }
    }

    private void validateProducts(List<UUID> productIds) {
        if (productIds == null || productIds.isEmpty()) {
            return;
        }
        Set<UUID> unique = new HashSet<>(productIds);
        Set<UUID> existing = productRepository.findByIds(unique).stream()
                .map(Product::getId)
                .collect(Collectors.toSet());
        if (!existing.containsAll(unique)) {
            throw new NotFoundException("Uno o más productos no existen");
        }
    }

    private BigDecimal defaultAmount(BigDecimal amount) {
        return amount != null ? amount : BigDecimal.ZERO;
    }
}
