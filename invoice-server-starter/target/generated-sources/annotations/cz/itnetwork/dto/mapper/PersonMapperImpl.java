package cz.itnetwork.dto.mapper;

import cz.itnetwork.dto.PersonDTO;
import cz.itnetwork.entity.PersonEntity;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.3.Final, compiler: javac, environment: Java 17.0.16 (Microsoft)"
)
@Component
public class PersonMapperImpl implements PersonMapper {

    @Override
    public PersonDTO toDTO(PersonEntity entity) {
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
    public PersonEntity toEntity(PersonDTO dto) {
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

    @Override
    public void updatePersonEntity(PersonDTO dto, PersonEntity entity) {
        if ( dto == null ) {
            return;
        }

        entity.setName( dto.getName() );
        entity.setIdentificationNumber( dto.getIdentificationNumber() );
        entity.setTaxNumber( dto.getTaxNumber() );
        entity.setAccountNumber( dto.getAccountNumber() );
        entity.setBankCode( dto.getBankCode() );
        entity.setIban( dto.getIban() );
        entity.setTelephone( dto.getTelephone() );
        entity.setMail( dto.getMail() );
        entity.setStreet( dto.getStreet() );
        entity.setZip( dto.getZip() );
        entity.setCity( dto.getCity() );
        entity.setCountry( dto.getCountry() );
        entity.setNote( dto.getNote() );
    }
}
