package cz.itnetwork.service;

import cz.itnetwork.dto.InvoiceDTO;
import cz.itnetwork.dto.PersonDTO;
import cz.itnetwork.dto.PersonStatisticsDTO;
import cz.itnetwork.entity.PersonEntity;

import java.util.List;

public interface PersonService {

    PersonDTO addPerson(PersonDTO personDTO);

    void removePerson(long id);

    List<PersonDTO> getAll();

    PersonDTO getPersonById(long personId);

    PersonDTO updatePerson(long personId, PersonDTO personDTO);

    List<PersonStatisticsDTO> getPersonStatistics();

    List<InvoiceDTO> getSalesByPerson(String identificationNumber);

    List<InvoiceDTO> getPurchasesByPerson(String identificationNumber);

    PersonEntity fetchPersonById(Long id);
}