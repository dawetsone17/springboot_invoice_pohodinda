// PersonRepository.java
package cz.itnetwork.entity.repository;

import cz.itnetwork.entity.PersonEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PersonRepository extends JpaRepository<PersonEntity, Long> {

    List<PersonEntity> findByHidden(boolean hidden);
    Optional<PersonEntity> findByIdentificationNumber(String identificationNumber);

    @Query("SELECT p FROM person p LEFT JOIN FETCH p.sales LEFT JOIN FETCH p.purchases WHERE p.hidden = false")
    List<PersonEntity> findByHiddenAndFetchInvoices(boolean hidden);
}