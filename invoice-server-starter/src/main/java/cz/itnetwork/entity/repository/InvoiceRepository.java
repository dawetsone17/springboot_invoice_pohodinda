package cz.itnetwork.entity.repository;

import cz.itnetwork.entity.InvoiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<InvoiceEntity, Long>, JpaSpecificationExecutor<InvoiceEntity> {

    // Filtrování podle ID kupujícího
    List<InvoiceEntity> findByBuyerId(Long buyerId);

    // Filtrování podle ID prodávajícího
    List<InvoiceEntity> findBySellerId(Long sellerId);

    // Filtrování podle názvu produktu (case-insensitive)
    List<InvoiceEntity> findByProductContainingIgnoreCase(String product);

    // Filtrování podle minimální ceny
    List<InvoiceEntity> findByPriceGreaterThanEqual(Long minPrice);

    // Filtrování podle maximální ceny
    List<InvoiceEntity> findByPriceLessThanEqual(Long maxPrice);

    // Načte jednu fakturu i s detaily prodávajícího a kupujícího
    @Query("SELECT i FROM InvoiceEntity i LEFT JOIN FETCH i.seller LEFT JOIN FETCH i.buyer WHERE i.id = :id")
    Optional<InvoiceEntity> findByIdWithPersons(@Param("id") Long id);

    // Nově přidaná metoda pro načtení všech faktur s detaily o prodávajícím a kupujícím
    @Query("SELECT i FROM InvoiceEntity i LEFT JOIN FETCH i.seller LEFT JOIN FETCH i.buyer")
    List<InvoiceEntity> findAllWithPersons();

    // Nově přidaná metoda pro nalezení nejvyššího ID faktury
    /**
     * Dotaz pro nalezení nejvyššího ID faktury v databázi.
     *
     * @return Nejvyšší ID faktury (typu Long), nebo null, pokud v databázi nejsou žádné faktury.
     */
    @Query("SELECT MAX(i.id) FROM InvoiceEntity i")
    Long findLastId();

    // vrátí poslední pořadové číslo faktury pro daný rok a měsíc
    @Query("SELECT MAX(CAST(SUBSTRING(i.invoiceNumber, 7) AS int)) FROM InvoiceEntity i WHERE i.invoiceNumber LIKE ?1")
    Optional<Integer> findLastInvoiceNumberInMonth(String prefix);


    /**
     * Spočítá celkovou sumu cen všech faktur v databázi.
     * Používá databázovou funkci SUM, aby se dotaz provedl efektivně.
     *
     * @return Součet cen všech faktur.
     */
    @Query("SELECT SUM(i.price) FROM InvoiceEntity i")
    Long calculateAllTimeSum();

    /**
     * Spočítá sumu cen všech faktur pro daný rok.
     *
     * @param year Rok, pro který se má součet spočítat.
     * @return Součet cen faktur z daného roku.
     */
    @Query("SELECT SUM(i.price) FROM InvoiceEntity i WHERE YEAR(i.issued) = :year")
    Long calculateCurrentYearSum(@Param("year") int year);
}
