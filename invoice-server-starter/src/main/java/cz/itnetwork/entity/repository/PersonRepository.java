package cz.itnetwork.entity.repository;

import cz.itnetwork.entity.PersonEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@Repository
public interface PersonRepository extends JpaRepository<PersonEntity, Long>, JpaSpecificationExecutor<PersonEntity> {

    // Vyhledá osoby na základě stavu "hidden" (skryté)
    List<PersonEntity> findByHidden(boolean hidden);

    /**
     * Vyhledá osobu podle jejího identifikačního čísla (IČO).
     *
     * @param identificationNumber IČO osoby.
     * @return Optional s nalezenou osobou, nebo prázdný Optional, pokud osoba nebyla nalezena.
     */
    Optional<PersonEntity> findByIdentificationNumber(String identificationNumber);

    /**
     * Získá seznam osob, které nejsou skryté, a načte jejich prodeje a nákupy.
     *
     * @param hidden Indikátor, zda má být osoba skrytá.
     * @return Seznam nalezených osob.
     */
    @Query("SELECT p FROM person p LEFT JOIN FETCH p.sales LEFT JOIN FETCH p.purchases WHERE p.hidden = :hidden")
    List<PersonEntity> findByHiddenAndFetchInvoices(@Param("hidden") boolean hidden);
}