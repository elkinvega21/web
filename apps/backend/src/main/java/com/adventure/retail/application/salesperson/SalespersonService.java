package com.adventure.retail.application.salesperson;

import com.adventure.retail.application.exception.NotFoundException;
import com.adventure.retail.domain.salesperson.Salesperson;
import com.adventure.retail.domain.salesperson.SalespersonRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class SalespersonService {

    private static final BigDecimal DEFAULT_COMMISSION = new BigDecimal("0.05");
    private static final String DEFAULT_STATUS = "Activo";

    private final SalespersonRepository salespersonRepository;

    public SalespersonService(SalespersonRepository salespersonRepository) {
        this.salespersonRepository = salespersonRepository;
    }

    @Transactional(readOnly = true)
    public List<Salesperson> list(String query, String status) {
        return salespersonRepository.search(query, status);
    }

    @Transactional(readOnly = true)
    public Salesperson getById(UUID id) {
        return salespersonRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Vendedor no encontrado"));
    }

    @Transactional
    public Salesperson create(SalespersonRequest request) {
        String code = StringUtils.hasText(request.code())
                ? request.code().trim().toUpperCase(Locale.ROOT)
                : nextCode();

        Salesperson salesperson = Salesperson.create(
                code,
                request.name().trim(),
                request.email(),
                request.phone(),
                request.territoryId(),
                request.commissionRate() != null ? request.commissionRate() : DEFAULT_COMMISSION,
                request.monthlyGoal() != null ? request.monthlyGoal() : BigDecimal.ZERO,
                StringUtils.hasText(request.status()) ? request.status() : DEFAULT_STATUS);

        return salespersonRepository.save(salesperson);
    }

    @Transactional
    public Salesperson update(UUID id, SalespersonRequest request) {
        Salesperson current = getById(id);
        Salesperson updated = current.withUpdatedData(
                request.name().trim(),
                request.email(),
                request.phone(),
                request.territoryId(),
                StringUtils.hasText(request.status()) ? request.status() : current.getStatus(),
                request.commissionRate() != null ? request.commissionRate() : current.getCommissionRate(),
                request.monthlyGoal() != null ? request.monthlyGoal() : current.getMonthlyGoal());

        return salespersonRepository.save(updated);
    }

    @Transactional
    public void delete(UUID id) {
        getById(id);
        salespersonRepository.deleteById(id);
    }

    private String nextCode() {
        return String.format(Locale.ROOT, "VEN-%03d", salespersonRepository.count() + 1);
    }
}
