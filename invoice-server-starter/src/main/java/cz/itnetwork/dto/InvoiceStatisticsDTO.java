package cz.itnetwork.dto;

public class InvoiceStatisticsDTO {

    private long currentYearSum;
    private long allTimeSum;
    private long invoicesCount;

    public InvoiceStatisticsDTO(long currentYearSum, long allTimeSum, long invoicesCount) {
        this.currentYearSum = currentYearSum;
        this.allTimeSum = allTimeSum;
        this.invoicesCount = invoicesCount;
    }

    public long getCurrentYearSum() {
        return currentYearSum;
    }

    public long getAllTimeSum() {
        return allTimeSum;
    }

    public long getInvoicesCount() {
        return invoicesCount;
    }
}