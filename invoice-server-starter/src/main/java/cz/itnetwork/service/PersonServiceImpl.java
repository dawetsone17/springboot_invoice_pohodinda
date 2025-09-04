package cz.itnetwork.service;

import cz.itnetwork.dto.InvoiceDTO;
import cz.itnetwork.dto.PersonDTO;
import cz.itnetwork.dto.PersonStatisticsDTO;
import cz.itnetwork.dto.mapper.InvoiceMapper;
import cz.itnetwork.dto.mapper.PersonMapper;
import cz.itnetwork.entity.InvoiceEntity;
import cz.itnetwork.entity.PersonEntity;
import cz.itnetwork.entity.repository.PersonRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.webjars.NotFoundException;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PersonServiceImpl implements PersonService {

    private static final Logger logger = LoggerFactory.getLogger(PersonServiceImpl.class);

    @Autowired
    private PersonMapper personMapper;

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private InvoiceMapper invoiceMapper;

    @Override
    public PersonDTO addPerson(PersonDTO personDTO) {
        PersonEntity entity = this.personMapper.toEntity(personDTO);
        entity = this.personRepository.save(entity);
        return this.personMapper.toDTO(entity);
    }

    @Override
    public void removePerson(long personId) {
        try {
            PersonEntity person = this.fetchPersonById(personId);
            person.setHidden(true);
            this.personRepository.save(person);
        } catch (NotFoundException e) {
            // Ignorujeme, pokud osoba neexistuje
        }
    }

    @Override
    public List<PersonDTO> getAll() {
        return this.personRepository.findByHidden(false).stream()
                .map(this.personMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PersonDTO getPersonById(long personId) {
        PersonEntity person = fetchPersonById(personId);
        return personMapper.toDTO(person);
    }

    @Override
    public PersonDTO updatePerson(long personId, PersonDTO personDTO) {
        PersonEntity existingPerson = fetchPersonById(personId);
        personMapper.updatePersonEntity(personDTO, existingPerson);
        return personMapper.toDTO(personRepository.save(existingPerson));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PersonStatisticsDTO> getPersonStatistics(String sortColumn, String sortDirection) {
        List<PersonEntity> people = personRepository.findByHidden(false);

        List<PersonStatisticsDTO> statistics = people.stream()
                .map(person -> {
                    long revenue = person.getSales().stream()
                            .mapToLong(InvoiceEntity::getPrice)
                            .sum();

                    long expenses = person.getPurchases().stream()
                            .mapToLong(InvoiceEntity::getPrice)
                            .sum();

                    return new PersonStatisticsDTO(person.getId(), person.getName(), revenue, expenses);
                })
                .collect(Collectors.toList());

        Comparator<PersonStatisticsDTO> comparator;
        switch (sortColumn) {
            case "name":
                // Zde je oprava - používáme metodu getName() z DTO
                comparator = Comparator.comparing(PersonStatisticsDTO::getName, String.CASE_INSENSITIVE_ORDER);
                break;
            case "revenue":
                comparator = Comparator.comparingLong(PersonStatisticsDTO::getRevenue);
                break;
            case "expenses":
                comparator = Comparator.comparingLong(PersonStatisticsDTO::getExpenses);
                break;
            default: // Výchozí řazení podle ID
                comparator = Comparator.comparingLong(PersonStatisticsDTO::getPersonId);
                break;
        }

        if ("desc".equalsIgnoreCase(sortDirection)) {
            comparator = comparator.reversed();
        }

        statistics.sort(comparator);
        return statistics;
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceDTO> getSalesByPerson(String identificationNumber) {
        PersonEntity person = personRepository.findByIdentificationNumber(identificationNumber)
                .orElseThrow(() -> new NotFoundException("Osoba s IČ " + identificationNumber + " nebyla nalezena."));

        return person.getSales().stream()
                .map(invoiceMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceDTO> getPurchasesByPerson(String identificationNumber) {
        PersonEntity person = personRepository.findByIdentificationNumber(identificationNumber)
                .orElseThrow(() -> new NotFoundException("Osoba s IČ " + identificationNumber + " nebyla nalezena."));

        return person.getPurchases().stream()
                .map(invoiceMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PersonEntity fetchPersonById(Long id) {
        return this.personRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Person with id " + id + " wasn't found in the database."));
    }
}