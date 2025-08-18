package cz.itnetwork.service;

import cz.itnetwork.dto.InvoiceDTO;
import cz.itnetwork.dto.InvoiceStatisticsDTO;
import cz.itnetwork.dto.PersonStatisticsDTO;

import java.util.List;
import java.util.Map;

public interface InvoiceService {
    InvoiceDTO addInvoice(InvoiceDTO invoiceDTO);

    // Metoda pro získání všech faktur s volitelnými filtry
    List<InvoiceDTO> getInvoices(Map<String, String> filterParams);

    InvoiceDTO getInvoiceDetail(Long invoiceId);
    void deleteInvoice(Long invoiceId);
    InvoiceDTO updateInvoice(Long invoiceId, InvoiceDTO invoiceDTO);
    InvoiceStatisticsDTO getInvoiceStatistics();

    }