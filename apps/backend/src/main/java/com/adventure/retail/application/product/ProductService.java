package com.adventure.retail.application.product;

import com.adventure.retail.application.exception.ConflictException;
import com.adventure.retail.application.exception.NotFoundException;
import com.adventure.retail.domain.product.Product;
import com.adventure.retail.domain.product.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class ProductService {

    private static final String DEFAULT_STATUS = "Activo";
    private static final String DEFAULT_UNIT = "unidad";

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<Product> list(String query, String category, String status) {
        return productRepository.search(query, category, status);
    }

    @Transactional(readOnly = true)
    public Product getById(UUID id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Producto no encontrado"));
    }

    @Transactional
    public Product create(ProductRequest request) {
        String sku = normalizeSku(request.sku());
        validateSku(null, sku);

        Product product = Product.create(
                sku,
                request.name().trim(),
                request.category(),
                request.description(),
                StringUtils.hasText(request.unit()) ? request.unit() : DEFAULT_UNIT,
                request.price(),
                request.cost() != null ? request.cost() : BigDecimal.ZERO,
                request.stock() != null ? request.stock() : 0,
                request.stockMin() != null ? request.stockMin() : 0,
                StringUtils.hasText(request.status()) ? request.status() : DEFAULT_STATUS);

        return productRepository.save(product);
    }

    @Transactional
    public Product update(UUID id, ProductRequest request) {
        Product current = getById(id);
        String sku = normalizeSku(request.sku());
        validateSku(id, sku);

        Product updated = current.withUpdatedData(
                request.name().trim(),
                request.category(),
                request.description(),
                StringUtils.hasText(request.unit()) ? request.unit() : current.getUnit(),
                request.price(),
                request.cost() != null ? request.cost() : BigDecimal.ZERO,
                request.stock() != null ? request.stock() : current.getStock(),
                request.stockMin() != null ? request.stockMin() : current.getStockMin(),
                StringUtils.hasText(request.status()) ? request.status() : current.getStatus());

        return productRepository.save(updated);
    }

    @Transactional
    public void delete(UUID id) {
        getById(id);
        productRepository.deleteById(id);
    }

    private String normalizeSku(String sku) {
        return sku == null ? "" : sku.trim().toUpperCase(Locale.ROOT);
    }

    private void validateSku(UUID id, String normalizedSku) {
        if (productRepository.existsBySku(normalizedSku)) {
            productRepository.findById(id)
                    .filter(product -> product.getSku().equals(normalizedSku))
                    .orElseThrow(() -> new ConflictException("Ya existe un producto con ese SKU"));
        }
    }
}