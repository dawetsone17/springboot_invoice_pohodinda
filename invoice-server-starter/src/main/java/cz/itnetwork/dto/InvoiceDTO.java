package cz.itnetwork.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceDTO {

    private Long id;
    private int invoiceNumber;
    private LocalDate issued;
    private LocalDate dueDate;
    private String product;
    private Long price;
    private int vat;
    private String note;


    private PersonDTO seller;
    private PersonDTO buyer;

}