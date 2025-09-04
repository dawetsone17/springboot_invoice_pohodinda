package cz.itnetwork.service;

import cz.itnetwork.dto.InvoiceDTO;
import cz.itnetwork.dto.InvoiceStatisticsDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface InvoiceService {

    /**
     * Přidá novou fakturu.
     */
    InvoiceDTO addInvoice(InvoiceDTO invoiceDTO);

    /**
     * Vrátí seznam všech faktur s volitelnými filtry a paginací.
     */
    Page<InvoiceDTO> getInvoices(Map<String, String> filterParams, Pageable pageable);

    /**
     * Vrátí detail faktury podle ID.
     */
    InvoiceDTO getInvoiceDetail(Long invoiceId);

    /**
     * Smaže fakturu podle ID.
     */
    void deleteInvoice(Long invoiceId);

    /**
     * Aktualizuje existující fakturu.
     */
    InvoiceDTO updateInvoice(Long invoiceId, InvoiceDTO invoiceDTO);

    /**
     * Vrátí statistiky všech faktur.
     */
    InvoiceStatisticsDTO getInvoiceStatistics();

    /**
     * Vrátí ID poslední faktury (pokud existuje).
     */
    Long findLastInvoiceId();

    /**
     * Vrátí další volné číslo faktury ve formátu např. 20250801.
     */
    String getNextInvoiceNumber();

    /**
     * Vrátí seznam jedinečných názvů produktů z databáze.
     */
    List<String> getProducts();
}