package com.adventure.retail.presentation.product;

import com.adventure.retail.application.product.ProductDto;
import com.adventure.retail.application.product.ProductRequest;
import com.adventure.retail.application.product.ProductService;
import com.adventure.retail.domain.product.Product;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<ProductDto> list(@RequestParam(required = false) String q,
                                 @RequestParam(required = false) String category,
                                 @RequestParam(required = false) String status) {
        return productService.list(q, category, status).stream().map(this::toDto).toList();
    }

    @GetMapping("/{id}")
    public ProductDto getById(@PathVariable UUID id) {
        return toDto(productService.getById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductDto create(@Valid @RequestBody ProductRequest request) {
        return toDto(productService.create(request));
    }

    @PutMapping("/{id}")
    public ProductDto update(@PathVariable UUID id, @Valid @RequestBody ProductRequest request) {
        return toDto(productService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        productService.delete(id);
    }

    private ProductDto toDto(Product product) {
        return new ProductDto(
                product.getId(),
                product.getSku(),
                product.getName(),
                product.getCategory(),
                product.getDescription(),
                product.getUnit(),
                product.getPrice(),
                product.getCost(),
                product.getStock(),
                product.getStockMin(),
                product.getStatus(),
                product.isLowStock(),
                product.getCreatedAt());
    }
}