package com.adventure.retail.application.product;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.adventure.retail.application.exception.ConflictException;
import com.adventure.retail.domain.product.Product;
import com.adventure.retail.domain.product.ProductRepository;
import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ProductServiceTest {

    private ProductRepository productRepository;
    private ProductService productService;

    @BeforeEach
    void setUp() {
        productRepository = mock(ProductRepository.class);
        productService = new ProductService(productRepository);
    }

    @Test
    void createShouldNormalizeSku() {
        when(productRepository.existsBySku("ADV-LIN-007")).thenReturn(false);
        when(productRepository.save(any(Product.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Product product = productService.create(new ProductRequest(
                "adv-lin-007", "Linterna recargable", "Accesorios", null, "unidad", new BigDecimal("39.90"),
                new BigDecimal("22.00"), 50, 10, null));

        assertThat(product.getSku()).isEqualTo("ADV-LIN-007");
    }

    @Test
    void createShouldRejectDuplicateSku() {
        when(productRepository.existsBySku("ADV-LIN-007")).thenReturn(true);

        assertThatThrownBy(() -> productService.create(new ProductRequest(
                "ADV-LIN-007", "Linterna", "Accesorios", null, "unidad", new BigDecimal("10"), null, 1, 0, null)))
                .isInstanceOf(ConflictException.class);
    }

    @Test
    void lowStockShouldReflectStockBelowMinimum() {
        Product product = Product.create("ADV-X", "Producto", "Cat", null, "unidad", new BigDecimal("10"),
                BigDecimal.ZERO, 5, 10, "Activo");

        assertThat(product.isLowStock()).isTrue();
    }
}