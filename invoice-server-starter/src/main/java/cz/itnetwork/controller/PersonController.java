package cz.itnetwork.controller;

import cz.itnetwork.dto.InvoiceDTO;
import cz.itnetwork.dto.PersonDTO;
import cz.itnetwork.dto.PersonStatisticsDTO;
import cz.itnetwork.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/persons")
public class PersonController {

    @Autowired
    private PersonService personService;

    @PostMapping
    public PersonDTO addPerson(@RequestBody PersonDTO personDTO) {
        return personService.addPerson(personDTO);
    }

    @GetMapping
    public List<PersonDTO> getAllPersons() {
        return personService.getAll();
    }

    @DeleteMapping("/{id}")
    public void deletePerson(@PathVariable Long id) {
        personService.removePerson(id);
    }

    @GetMapping("/{id}")
    public PersonDTO getPersonById(@PathVariable Long id) {
        return personService.getPersonById(id);
    }

    @PutMapping("/{id}")
    public PersonDTO updatePerson(@PathVariable Long id, @RequestBody PersonDTO personDTO) {
        return personService.updatePerson(id, personDTO);
    }

    @GetMapping("/statistics")
    public List<PersonStatisticsDTO> getPersonStatistics(
            @RequestParam(defaultValue = "id") String sortColumn,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        return personService.getPersonStatistics(sortColumn, sortDirection);
    }

    // NOVÝ ENDPOINT pro vystavené faktury
    @GetMapping("/{identificationNumber}/sales")
    public List<InvoiceDTO> getSalesByPerson(@PathVariable String identificationNumber) {
        return personService.getSalesByPerson(identificationNumber);
    }

    // NOVÝ ENDPOINT pro přijaté faktury
    @GetMapping("/{identificationNumber}/purchases")
    public List<InvoiceDTO> getPurchasesByPerson(@PathVariable String identificationNumber) {
        return personService.getPurchasesByPerson(identificationNumber);
    }
}