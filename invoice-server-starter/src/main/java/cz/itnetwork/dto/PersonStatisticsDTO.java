package cz.itnetwork.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Generuje gettery, settery, toString, equals a hashCode
@AllArgsConstructor // Generuje konstruktor se všemi poli
@NoArgsConstructor  // Generuje bezparametrický konstruktor
public class PersonStatisticsDTO {

    private Long personId;
    private String name;
    private long revenue;
    private long expenses;
}