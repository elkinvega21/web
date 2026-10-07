package com.adventure.retail.application.salesperson;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.adventure.retail.domain.salesperson.Salesperson;
import com.adventure.retail.domain.salesperson.SalespersonRepository;
import java.math.BigDecimal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class SalespersonServiceTest {

    private SalespersonRepository salespersonRepository;
    private SalespersonService salespersonService;

    @BeforeEach
    void setUp() {
        salespersonRepository = mock(SalespersonRepository.class);
        salespersonService = new SalespersonService(salespersonRepository);
    }

    @Test
    void createShouldGenerateCodeAndDefaultCommission() {
        when(salespersonRepository.count()).thenReturn(4L);
        when(salespersonRepository.save(any(Salesperson.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Salesperson salesperson = salespersonService.create(new SalespersonRequest(
                null, "Sofía Restrepo", "sofia@adventure.com", "3125551010", null, null, null, null));

        assertThat(salesperson.getCode()).isEqualTo("VEN-005");
        assertThat(salesperson.getCommissionRate()).isEqualByComparingTo("0.05");
        assertThat(salesperson.getSalesTotal()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(salesperson.getMonthlyGoal()).isEqualByComparingTo(BigDecimal.ZERO);
        verify(salespersonRepository).save(salesperson);
    }

    @Test
    void addSalesShouldAccumulateTotalAndMonthly() {
        Salesperson salesperson = Salesperson.create(
                "VEN-001", "Sofía", null, null, null, new BigDecimal("0.05"), BigDecimal.ZERO, "Activo");

        Salesperson updated = salesperson.addSales(new BigDecimal("250.00"));

        assertThat(updated.getSalesTotal()).isEqualByComparingTo("250.00");
        assertThat(updated.getSalesMonth()).isEqualByComparingTo("250.00");
    }

    @Test
    void goalCompletionShouldBePercentageOfMonthlyGoal() {
        Salesperson salesperson = Salesperson.create(
                "VEN-002", "Diego", null, null, null, new BigDecimal("0.05"), new BigDecimal("1000.00"), "Activo");

        assertThat(salesperson.goalCompletion()).isZero();
        assertThat(salesperson.addSales(new BigDecimal("1250.00")).goalCompletion()).isEqualTo(125);
    }

    @Test
    void goalCompletionShouldBeZeroWhenNoGoalDefined() {
        Salesperson salesperson = Salesperson.create(
                "VEN-003", "Camila", null, null, null, new BigDecimal("0.05"), BigDecimal.ZERO, "Activo");

        assertThat(salesperson.addSales(new BigDecimal("900.00")).goalCompletion()).isZero();
    }
}
