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
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.webjars.NotFoundException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class InvoiceServiceImpl implements InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private InvoiceMapper invoiceMapper;

    @Override
    @Transactional
    public InvoiceDTO addInvoice(InvoiceDTO invoiceDTO) {
        // We're expecting a full PersonDTO object with an ID from the frontend.
        // We check for null to prevent a NullPointerException.
        if (invoiceDTO.getSeller() == null || invoiceDTO.getBuyer() == null) {
            throw new IllegalArgumentException("Seller and Buyer must be provided.");
        }

        // Get the managed entities for seller and buyer from the database.
        PersonEntity seller = personRepository.findById(invoiceDTO.getSeller().getId())
                .orElseThrow(() -> new NotFoundException("Prodávající s ID " + invoiceDTO.getSeller().getId() + " nebyl nalezen."));

        PersonEntity buyer = personRepository.findById(invoiceDTO.getBuyer().getId())
                .orElseThrow(() -> new NotFoundException("Kupující s ID " + invoiceDTO.getBuyer().getId() + " nebyl nalezen."));

        // Map the DTO to the entity and set the relationships.
        InvoiceEntity newInvoice = invoiceMapper.toEntity(invoiceDTO);
        newInvoice.setSeller(seller);
        newInvoice.setBuyer(buyer);

        // Save and return the DTO.
        InvoiceEntity savedInvoice = invoiceRepository.save(newInvoice);
        return invoiceMapper.toDTO(savedInvoice);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceDTO> getInvoices(Map<String, String> filterParams) {
        Specification<InvoiceEntity> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filterParams.get("minPrice") != null && !filterParams.get("minPrice").isEmpty()) {
                long minPrice = Long.parseLong(filterParams.get("minPrice"));
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (filterParams.get("maxPrice") != null && !filterParams.get("maxPrice").isEmpty()) {
                long maxPrice = Long.parseLong(filterParams.get("maxPrice"));
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice));
            }
            // The frontend is sending buyerId/sellerId as separate parameters, so the filter logic is correct here.
            // The issue was in add/update, which expected the ID nested in the DTO.
            if (filterParams.get("buyerId") != null && !filterParams.get("buyerId").isEmpty()) {
                long buyerId = Long.parseLong(filterParams.get("buyerId"));
                predicates.add(criteriaBuilder.equal(root.get("buyer").get("id"), buyerId));
            }
            if (filterParams.get("sellerId") != null && !filterParams.get("sellerId").isEmpty()) {
                long sellerId = Long.parseLong(filterParams.get("sellerId"));
                predicates.add(criteriaBuilder.equal(root.get("seller").get("id"), sellerId));
            }
            if (filterParams.get("product") != null && !filterParams.get("product").isEmpty()) {
                String product = filterParams.get("product");
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("product")), "%" + product.toLowerCase() + "%"));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        return invoiceRepository.findAll(spec).stream()
                .map(invoiceMapper::toDTO)
                .collect(Collectors.toList());
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

        // Check for null to prevent NullPointerException
        if (invoiceDTO.getSeller() == null || invoiceDTO.getBuyer() == null) {
            throw new IllegalArgumentException("Seller and Buyer must be provided.");
        }

        PersonEntity seller = personRepository.findById(invoiceDTO.getSeller().getId())
                .orElseThrow(() -> new NotFoundException("Prodávající s ID " + invoiceDTO.getSeller().getId() + " nebyl nalezen."));

        PersonEntity buyer = personRepository.findById(invoiceDTO.getBuyer().getId())
                .orElseThrow(() -> new NotFoundException("Kupující s ID " + invoiceDTO.getBuyer().getId() + " nebyl nalezen."));

        existingInvoice.setInvoiceNumber(invoiceDTO.getInvoiceNumber());
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
        long invoicesCount = invoiceRepository.count();
        long allTimeSum = invoiceRepository.findAll().stream()
                .mapToLong(InvoiceEntity::getPrice)
                .sum();

        int currentYear = LocalDate.now().getYear();
        long currentYearSum = invoiceRepository.findAll().stream()
                .filter(invoice -> invoice.getIssued().getYear() == currentYear)
                .mapToLong(InvoiceEntity::getPrice)
                .sum();

        return new InvoiceStatisticsDTO(currentYearSum, allTimeSum, invoicesCount);
    }
}