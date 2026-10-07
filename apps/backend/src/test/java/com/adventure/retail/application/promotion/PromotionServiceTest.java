package com.adventure.retail.application.promotion;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyCollection;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.adventure.retail.application.exception.ConflictException;
import com.adventure.retail.application.exception.NotFoundException;
import com.adventure.retail.domain.product.Product;
import com.adventure.retail.domain.product.ProductRepository;
import com.adventure.retail.domain.promotion.Promotion;
import com.adventure.retail.domain.promotion.PromotionRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PromotionServiceTest {

    private PromotionRepository promotionRepository;
    private ProductRepository productRepository;
    private PromotionService promotionService;

    @BeforeEach
    void setUp() {
        promotionRepository = mock(PromotionRepository.class);
        productRepository = mock(ProductRepository.class);
        promotionService = new PromotionService(promotionRepository, productRepository);
    }

    private PromotionRequest request() {
        return new PromotionRequest(
                "Liquidación julio",
                "20% en carpas",
                Promotion.TYPE_PERCENTAGE,
                BigDecimal.valueOf(20),
                LocalDate.now().minusDays(1),
                LocalDate.now().plusDays(30),
                true,
                "Sin monto mínimo",
                BigDecimal.ZERO,
                List.of());
    }

    @Test
    void createShouldSaveActivePromotionWithDefaultAmount() {
        when(promotionRepository.save(any(Promotion.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Promotion created = promotionService.create(request());

        assertThat(created.isActive()).isTrue();
        assertThat(created.getMinimumAmount()).isEqualTo(BigDecimal.ZERO);
        assertThat(created.getStatus(LocalDate.now())).isEqualTo(Promotion.STATUS_ACTIVE);
    }

    @Test
    void createShouldRejectDuplicateName() {
        when(promotionRepository.existsByName("Liquidación julio")).thenReturn(true);

        assertThatThrownBy(() -> promotionService.create(request()))
                .isInstanceOf(ConflictException.class);
    }

    @Test
    void createShouldRejectInvalidType() {
        PromotionRequest invalid = new PromotionRequest(
                "X", null, "Bogotazo", BigDecimal.valueOf(10),
                LocalDate.now(), LocalDate.now().plusDays(1), true, null, null, null);

        assertThatThrownBy(() -> promotionService.create(invalid))
                .isInstanceOf(ConflictException.class);
    }

    @Test
    void createShouldRejectEndBeforeStart() {
        PromotionRequest invalid = new PromotionRequest(
                "X", null, Promotion.TYPE_PERCENTAGE, BigDecimal.valueOf(10),
                LocalDate.now().plusDays(5), LocalDate.now(), true, null, null, null);

        assertThatThrownBy(() -> promotionService.create(invalid))
                .isInstanceOf(ConflictException.class);
    }

    @Test
    void createShouldRejectPercentageOver100() {
        PromotionRequest invalid = new PromotionRequest(
                "X", null, Promotion.TYPE_PERCENTAGE, BigDecimal.valueOf(150),
                LocalDate.now(), LocalDate.now().plusDays(1), true, null, null, null);

        assertThatThrownBy(() -> promotionService.create(invalid))
                .isInstanceOf(ConflictException.class);
    }

    @Test
    void createShouldRejectUnknownProduct() {
        UUID productId = UUID.randomUUID();
        when(productRepository.findByIds(anyCollection())).thenReturn(List.of());
        PromotionRequest withProduct = new PromotionRequest(
                "X", null, Promotion.TYPE_PERCENTAGE, BigDecimal.valueOf(10),
                LocalDate.now(), LocalDate.now().plusDays(1), true, null, null, List.of(productId));

        assertThatThrownBy(() -> promotionService.create(withProduct))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void setActiveShouldDeactivatePromotion() {
        UUID id = UUID.randomUUID();
        Promotion active = Promotion.create("X", null, Promotion.TYPE_PERCENTAGE, BigDecimal.TEN,
                LocalDate.now().minusDays(1), LocalDate.now().plusDays(10), null, null, List.of());
        when(promotionRepository.findById(id)).thenReturn(Optional.of(active));
        when(promotionRepository.save(any(Promotion.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Promotion updated = promotionService.setActive(id, false);

        assertThat(updated.isActive()).isFalse();
        assertThat(updated.getStatus(LocalDate.now())).isEqualTo(Promotion.STATUS_DISABLED);
    }

    @Test
    void listShouldFilterByStatus() {
        Promotion scheduled = Promotion.create("Futura", null, Promotion.TYPE_PERCENTAGE, BigDecimal.TEN,
                LocalDate.now().plusDays(5), LocalDate.now().plusDays(20), null, null, List.of());
        Promotion active = Promotion.create("Actual", null, Promotion.TYPE_2X1, BigDecimal.valueOf(50),
                LocalDate.now().minusDays(1), LocalDate.now().plusDays(10), null, null, List.of());
        when(promotionRepository.findAll()).thenReturn(List.of(scheduled, active));

        List<Promotion> result = promotionService.list(null, null, Promotion.STATUS_SCHEDULED);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Futura");
    }

    @Test
    void expiringSoonShouldReturnOnlyActivePromotionsExpiringInWindow() {
        Promotion expiring = Promotion.create("Próxima a vencer", null, Promotion.TYPE_PERCENTAGE,
                BigDecimal.TEN, LocalDate.now().minusDays(1), LocalDate.now().plusDays(3), null, null, List.of());
        Promotion later = Promotion.create("Lejana", null, Promotion.TYPE_PERCENTAGE, BigDecimal.TEN,
                LocalDate.now().minusDays(1), LocalDate.now().plusDays(60), null, null, List.of());
        Promotion disabled = later.withActive(false);
        when(promotionRepository.findAll()).thenReturn(List.of(expiring, later, disabled));

        List<Promotion> result = promotionService.expiringSoon(7);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Próxima a vencer");
    }
}
