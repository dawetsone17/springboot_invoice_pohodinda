package cz.itnetwork.dto.mapper;

import cz.itnetwork.dto.InvoiceDTO;
import cz.itnetwork.dto.PersonDTO;
import cz.itnetwork.entity.InvoiceEntity;
import cz.itnetwork.entity.PersonEntity;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.3.Final, compiler: javac, environment: Java 17.0.16 (Microsoft)"
)
@Component
public class InvoiceMapperImpl implements InvoiceMapper {

    @Override
    public InvoiceDTO toDTO(InvoiceEntity entity) {
        if ( entity == null ) {
            return null;
        }

        InvoiceDTO invoiceDTO = new InvoiceDTO();

        invoiceDTO.setIssued( entity.getIssued() );
        invoiceDTO.setDueDate( entity.getDueDate() );
        invoiceDTO.setId( entity.getId() );
        invoiceDTO.setInvoiceNumber( entity.getInvoiceNumber() );
        invoiceDTO.setProduct( entity.getProduct() );
        invoiceDTO.setPrice( entity.getPrice() );
        invoiceDTO.setVat( entity.getVat() );
        invoiceDTO.setNote( entity.getNote() );
        invoiceDTO.setSeller( toPersonDTO( entity.getSeller() ) );
        invoiceDTO.setBuyer( toPersonDTO( entity.getBuyer() ) );

        return invoiceDTO;
    }

    @Override
    public InvoiceEntity toEntity(InvoiceDTO dto) {
        if ( dto == null ) {
            return null;
        }

        InvoiceEntity invoiceEntity = new InvoiceEntity();

        invoiceEntity.setIssued( dto.getIssued() );
        invoiceEntity.setDueDate( dto.getDueDate() );
        invoiceEntity.setSeller( toPersonEntity( dto.getSeller() ) );
        invoiceEntity.setBuyer( toPersonEntity( dto.getBuyer() ) );
        invoiceEntity.setId( dto.getId() );
        invoiceEntity.setInvoiceNumber( dto.getInvoiceNumber() );
        invoiceEntity.setProduct( dto.getProduct() );
        invoiceEntity.setPrice( dto.getPrice() );
        invoiceEntity.setVat( dto.getVat() );
        invoiceEntity.setNote( dto.getNote() );

        return invoiceEntity;
    }

    @Override
    public PersonDTO toPersonDTO(PersonEntity entity) {
        if ( entity == null ) {
            return null;
        }

        PersonDTO personDTO = new PersonDTO();

        personDTO.setId( entity.getId() );
        personDTO.setName( entity.getName() );
        personDTO.setIdentificationNumber( entity.getIdentificationNumber() );
        personDTO.setTaxNumber( entity.getTaxNumber() );
        personDTO.setAccountNumber( entity.getAccountNumber() );
        personDTO.setBankCode( entity.getBankCode() );
        personDTO.setIban( entity.getIban() );
        personDTO.setTelephone( entity.getTelephone() );
        personDTO.setMail( entity.getMail() );
        personDTO.setStreet( entity.getStreet() );
        personDTO.setZip( entity.getZip() );
        personDTO.setCity( entity.getCity() );
        personDTO.setCountry( entity.getCountry() );
        personDTO.setNote( entity.getNote() );

        return personDTO;
    }

    @Override
    public PersonEntity toPersonEntity(PersonDTO dto) {
        if ( dto == null ) {
            return null;
        }

        PersonEntity personEntity = new PersonEntity();

        personEntity.setId( dto.getId() );
        personEntity.setName( dto.getName() );
        personEntity.setIdentificationNumber( dto.getIdentificationNumber() );
        personEntity.setTaxNumber( dto.getTaxNumber() );
        personEntity.setAccountNumber( dto.getAccountNumber() );
        personEntity.setBankCode( dto.getBankCode() );
        personEntity.setIban( dto.getIban() );
        personEntity.setTelephone( dto.getTelephone() );
        personEntity.setMail( dto.getMail() );
        personEntity.setStreet( dto.getStreet() );
        personEntity.setZip( dto.getZip() );
        personEntity.setCity( dto.getCity() );
        personEntity.setCountry( dto.getCountry() );
        personEntity.setNote( dto.getNote() );

        return personEntity;
    }
}
