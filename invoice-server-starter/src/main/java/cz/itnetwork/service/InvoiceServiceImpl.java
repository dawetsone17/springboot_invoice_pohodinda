package cz.itnetwork.service;

import cz.itnetwork.dto.InvoiceDTO;
import cz.itnetwork.dto.InvoiceStatisticsDTO;
import cz.itnetwork.dto.mapper.InvoiceMapper;
import cz.itnetwork.entity.InvoiceEntity;
import cz.itnetwork.entity.PersonEntity;
import cz.itnetwork.entity.repository.InvoiceRepository;
import cz.itnetwork.entity.repository.PersonRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.webjars.NotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class InvoiceServiceImpl implements InvoiceService {

    private static final Logger logger = LoggerFactory.getLogger(InvoiceServiceImpl.class);

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private InvoiceMapper invoiceMapper;

    @Override
    @Transactional
    public InvoiceDTO addInvoice(InvoiceDTO invoiceDTO) {
        if (invoiceDTO.getSeller() == null || invoiceDTO.getBuyer() == null) {
            throw new IllegalArgumentException("Seller and Buyer must be provided.");
        }

        PersonEntity seller = personRepository.findById(invoiceDTO.getSeller().getId())
                .orElseThrow(() -> new NotFoundException("Prodávající s ID " + invoiceDTO.getSeller().getId() + " nebyl nalezen."));

        PersonEntity buyer = personRepository.findById(invoiceDTO.getBuyer().getId())
                .orElseThrow(() -> new NotFoundException("Kupující s ID " + invoiceDTO.getBuyer().getId() + " nebyl nalezen."));

        InvoiceEntity newInvoice = invoiceMapper.toEntity(invoiceDTO);
        newInvoice.setSeller(seller);
        newInvoice.setBuyer(buyer);

        InvoiceEntity savedInvoice = invoiceRepository.save(newInvoice);
        return invoiceMapper.toDTO(savedInvoice);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InvoiceDTO> getInvoices(Map<String, String> filterParams, Pageable pageable) {
        Specification<InvoiceEntity> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Časový filtr - od data a do data
            if (filterParams.containsKey("dateFrom") && !filterParams.get("dateFrom").isEmpty()) {
                try {
                    LocalDate dateFrom = LocalDate.parse(filterParams.get("dateFrom"));
                    predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("issued"), dateFrom));
                } catch (DateTimeParseException e) {
                    logger.debug("Invalid dateFrom format: {}", filterParams.get("dateFrom"));
                }
            }

            if (filterParams.containsKey("dateTo") && !filterParams.get("dateTo").isEmpty()) {
                try {
                    LocalDate dateTo = LocalDate.parse(filterParams.get("dateTo"));
                    predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("issued"), dateTo));
                } catch (DateTimeParseException e) {
                    logger.debug("Invalid dateTo format: {}", filterParams.get("dateTo"));
                }
            }

            // Ošetření záporných cen je v controlleru
            if (filterParams.containsKey("minPrice") && !filterParams.get("minPrice").isEmpty()) {
                try {
                    double minPrice = Double.parseDouble(filterParams.get("minPrice"));
                    predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice));
                } catch (NumberFormatException e) {
                    logger.debug("Invalid minPrice format: {}", filterParams.get("minPrice"));
                }
            }

            if (filterParams.containsKey("maxPrice") && !filterParams.get("maxPrice").isEmpty()) {
                try {
                    double maxPrice = Double.parseDouble(filterParams.get("maxPrice"));
                    predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice));
                } catch (NumberFormatException e) {
                    logger.debug("Invalid maxPrice format: {}", filterParams.get("maxPrice"));
                }
            }

            if (filterParams.containsKey("buyerIdentificationNumber") && !filterParams.get("buyerIdentificationNumber").isEmpty()) {
                String buyerIN = filterParams.get("buyerIdentificationNumber");
                predicates.add(criteriaBuilder.equal(root.get("buyer").get("identificationNumber"), buyerIN));
            }
            if (filterParams.containsKey("sellerIdentificationNumber") && !filterParams.get("sellerIdentificationNumber").isEmpty()) {
                String sellerIN = filterParams.get("sellerIdentificationNumber");
                predicates.add(criteriaBuilder.equal(root.get("seller").get("identificationNumber"), sellerIN));
            }
            if (filterParams.containsKey("product") && !filterParams.get("product").isEmpty()) {
                String product = filterParams.get("product");
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("product")), "%" + product.toLowerCase() + "%"));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        return invoiceRepository.findAll(spec, pageable).map(invoiceMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public InvoiceDTO getInvoiceDetail(Long invoiceId) {
        InvoiceEntity invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new NotFoundException("Faktura s ID " + invoiceId + " nebyla nalezena."));
        return invoiceMapper.toDTO(invoice);
    }

    @Override
    @Transactional
    public void deleteInvoice(Long invoiceId) {
        if (!invoiceRepository.existsById(invoiceId)) {
            throw new NotFoundException("Faktura s ID " + invoiceId + " nebyla nalezena.");
        }
        invoiceRepository.deleteById(invoiceId);
    }

    @Override
    @Transactional
    public InvoiceDTO updateInvoice(Long invoiceId, InvoiceDTO invoiceDTO) {
        InvoiceEntity existingInvoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new NotFoundException("Faktura s ID " + invoiceId + " nebyla nalezena."));

        if (invoiceDTO.getSeller() == null || invoiceDTO.getBuyer() == null) {
            throw new IllegalArgumentException("Seller and Buyer must be provided.");
        }

        PersonEntity seller = personRepository.findById(invoiceDTO.getSeller().getId())
                .orElseThrow(() -> new NotFoundException("Prodávající s ID " + invoiceDTO.getSeller().getId() + " nebyl nalezen."));

        PersonEntity buyer = personRepository.findById(invoiceDTO.getBuyer().getId())
                .orElseThrow(() -> new NotFoundException("Kupující s ID " + invoiceDTO.getBuyer().getId() + " nebyl nalezen."));

        existingInvoice.setInvoiceNumber(String.valueOf(invoiceDTO.getInvoiceNumber()));
        existingInvoice.setSeller(seller);
        existingInvoice.setBuyer(buyer);
        existingInvoice.setIssued(invoiceDTO.getIssued());
        existingInvoice.setDueDate(invoiceDTO.getDueDate());
        existingInvoice.setProduct(invoiceDTO.getProduct());
        existingInvoice.setPrice(invoiceDTO.getPrice());
        existingInvoice.setVat(invoiceDTO.getVat());
        existingInvoice.setNote(invoiceDTO.getNote());

        InvoiceEntity updatedInvoice = invoiceRepository.save(existingInvoice);
        return invoiceMapper.toDTO(updatedInvoice);
    }

    @Override
    @Transactional(readOnly = true)
    public InvoiceStatisticsDTO getInvoiceStatistics() {
        try {
            Long invoicesCount = invoiceRepository.count();
            Long allTimeSum = invoiceRepository.calculateAllTimeSum();
            Long currentYearSum = invoiceRepository.calculateCurrentYearSum(LocalDate.now().getYear());

            logger.info("Počet faktur: {}", invoicesCount);
            logger.info("Celkový součet cen: {}", allTimeSum);
            logger.info("Součet cen za aktuální rok: {}", currentYearSum);

            return new InvoiceStatisticsDTO(
                    currentYearSum != null ? currentYearSum : 0L,
                    allTimeSum != null ? allTimeSum : 0L,
                    invoicesCount != null ? invoicesCount : 0L
            );
        } catch (Exception e) {
            logger.error("Chyba při načítání statistik faktur", e);
            throw e;
        }
    }

    @Override
    public Long findLastInvoiceId() {
        return invoiceRepository.findLastId();
    }

    @Override
    public String getNextInvoiceNumber() {
        try {
            LocalDate today = LocalDate.now();
            String year = String.valueOf(today.getYear());
            String month = String.format("%02d", today.getMonthValue());

            String prefix = year + month;

            // Získání posledního pořadového čísla pro daný rok a měsíc
            Integer lastSequenceNumber = invoiceRepository.findLastInvoiceNumberInMonth(prefix + "%")
                    .orElse(0);

            // Zvýšení pořadového čísla o 1
            int nextSequenceNumber = lastSequenceNumber + 1;

            // Dynamické formátování bez fixního počtu nul
            String formattedSequenceNumber = String.valueOf(nextSequenceNumber);

            String newInvoiceNumber = prefix + formattedSequenceNumber;

            logger.info("GENERATED INVOICE NUMBER: {}", newInvoiceNumber);
            return newInvoiceNumber;
        } catch (Exception e) {
            logger.error("Chyba při generování čísla faktury", e);
            return "CHYBA";
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getProducts() {
        return invoiceRepository.findAll().stream()
                .map(InvoiceEntity::getProduct)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }
}