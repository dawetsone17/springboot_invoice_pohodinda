package cz.itnetwork.dto.mapper;

import cz.itnetwork.dto.InvoiceDTO;
import cz.itnetwork.dto.PersonDTO;
import cz.itnetwork.entity.InvoiceEntity;
import cz.itnetwork.entity.PersonEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InvoiceMapper {

    // Mapování z entity na DTO
    @Mapping(target = "issued", dateFormat = "yyyy-MM-dd")
    @Mapping(target = "dueDate", dateFormat = "yyyy-MM-dd")
    // Mapuje objekty "seller" a "buyer" přímo
    InvoiceDTO toDTO(InvoiceEntity entity);

    // Mapování z DTO na entitu. Zde musíte zajistit, že se objekty PersonDTO
    // správně převedou na PersonEntity
    @Mapping(target = "issued", dateFormat = "yyyy-MM-dd")
    @Mapping(target = "dueDate", dateFormat = "yyyy-MM-dd")
    @Mapping(target = "seller", source = "seller")
    @Mapping(target = "buyer", source = "buyer")
    InvoiceEntity toEntity(InvoiceDTO dto);

    // Důležité: Metody pro mapování mezi PersonEntity a PersonDTO.
    // MapStruct si je automaticky najde a použije pro vnořené objekty.
    PersonDTO toPersonDTO(PersonEntity entity);

    PersonEntity toPersonEntity(PersonDTO dto);

}