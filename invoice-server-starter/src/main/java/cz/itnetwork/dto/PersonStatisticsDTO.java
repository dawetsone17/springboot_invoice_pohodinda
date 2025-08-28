package cz.itnetwork.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Generuje gettery, settery, toString, equals a hashCode
@AllArgsConstructor // Konstruktor se všemi poli
@NoArgsConstructor  // Bezparametrický konstruktor
public class PersonStatisticsDTO {

    private Long personId;       // Změněno z 'long' na 'Long'
    private String personName;
    private long revenue;
    private long expenses;
}
