package cz.itnetwork.dto.mapper;

import cz.itnetwork.dto.PersonDTO;
import cz.itnetwork.entity.PersonEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface PersonMapper {

    // Mapování z entity na DTO
    PersonDTO toDTO(PersonEntity entity);

    // Mapování z DTO na entitu
    PersonEntity toEntity(PersonDTO dto);

    // Metoda pro aktualizaci existující entity z dat v DTO
    @Named("updatePersonEntity")
    @Mapping(target = "id", ignore = true)
    void updatePersonEntity(PersonDTO dto, @MappingTarget PersonEntity entity);

}