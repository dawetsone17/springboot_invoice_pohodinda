package cz.itnetwork.controller;

import cz.itnetwork.dto.InvoiceDTO;
import cz.itnetwork.dto.InvoiceStatisticsDTO;
import cz.itnetwork.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    @PostMapping
    public InvoiceDTO addInvoice(@RequestBody InvoiceDTO invoiceDTO) {
        return invoiceService.addInvoice(invoiceDTO);
    }

    @GetMapping
    public Page<InvoiceDTO> getInvoices(@RequestParam Map<String, String> filterParams, Pageable pageable) {
        // Logika validace byla přesunuta do service vrstvy.
        return invoiceService.getInvoices(filterParams, pageable);
    }

    @GetMapping("/{id}")
    public InvoiceDTO getInvoiceDetail(@PathVariable Long id) {
        return invoiceService.getInvoiceDetail(id);
    }

    @PutMapping("/{id}")
    public InvoiceDTO updateInvoice(@PathVariable Long id, @RequestBody InvoiceDTO invoiceDTO) {
        return invoiceService.updateInvoice(id, invoiceDTO);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteInvoice(@PathVariable Long id) {
        invoiceService.deleteInvoice(id);
    }

    @GetMapping("/statistics")
    public InvoiceStatisticsDTO getInvoiceStatistics() {
        return invoiceService.getInvoiceStatistics();
    }

    @GetMapping("/next-number")
    public String getNextInvoiceNumber() {
        return invoiceService.getNextInvoiceNumber();
    }

    @GetMapping("/products") // Nový endpoint pro produkty
    public List<String> getProducts() {
        return invoiceService.getProducts();
    }
}