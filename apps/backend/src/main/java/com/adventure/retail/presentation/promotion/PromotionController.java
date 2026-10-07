package com.adventure.retail.presentation.promotion;

import com.adventure.retail.application.promotion.PromotionDto;
import com.adventure.retail.application.promotion.PromotionRequest;
import com.adventure.retail.application.promotion.PromotionService;
import com.adventure.retail.domain.product.Product;
import com.adventure.retail.domain.product.ProductRepository;
import com.adventure.retail.domain.promotion.Promotion;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/promotions")
public class PromotionController {

    private final PromotionService promotionService;
    private final ProductRepository productRepository;

    public PromotionController(PromotionService promotionService, ProductRepository productRepository) {
        this.promotionService = promotionService;
        this.productRepository = productRepository;
    }

    @GetMapping
    public List<PromotionDto> list(@RequestParam(required = false) String q,
                                   @RequestParam(required = false) String type,
                                   @RequestParam(required = false) String status) {
        return promotionService.list(q, type, status).stream().map(this::toDto).toList();
    }

    @GetMapping("/expiring")
    public List<PromotionDto> expiring(@RequestParam(defaultValue = "7") int days) {
        return promotionService.expiringSoon(days).stream().map(this::toDto).toList();
    }

    @GetMapping("/{id}")
    public PromotionDto getById(@PathVariable UUID id) {
        return toDto(promotionService.getById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PromotionDto create(@Valid @RequestBody PromotionRequest request) {
        return toDto(promotionService.create(request));
    }

    @PutMapping("/{id}")
    public PromotionDto update(@PathVariable UUID id, @Valid @RequestBody PromotionRequest request) {
        return toDto(promotionService.update(id, request));
    }

    @PatchMapping("/{id}/active")
    public PromotionDto setActive(@PathVariable UUID id, @Valid @RequestBody ActiveRequest request) {
        return toDto(promotionService.setActive(id, request.active()));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        promotionService.delete(id);
    }

    private PromotionDto toDto(Promotion promotion) {
        Map<UUID, Product> products = productRepository.findByIds(promotion.getProductIds()).stream()
                .collect(Collectors.toMap(Product::getId, Function.identity()));

        List<String> productNames = promotion.getProductIds().stream()
                .map(id -> products.get(id) != null ? products.get(id).getName() : null)
                .toList();

        return new PromotionDto(
                promotion.getId(),
                promotion.getName(),
                promotion.getDescription(),
                promotion.getType(),
                promotion.getValue(),
                promotion.getStartDate(),
                promotion.getEndDate(),
                promotion.getStatus(LocalDate.now()),
                promotion.getConditions(),
                promotion.getMinimumAmount(),
                promotion.getProductIds(),
                productNames,
                promotion.getProductIds().size(),
                promotion.getCreatedAt(),
                promotion.getUpdatedAt());
    }

    public record ActiveRequest(@jakarta.validation.constraints.NotNull(message = "El campo active es obligatorio")
                                Boolean active) {
    }
}
