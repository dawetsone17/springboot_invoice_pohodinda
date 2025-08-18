package cz.itnetwork.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Automaticky generuje gettery, settery, toString, equals a hashCode
@AllArgsConstructor // Generuje konstruktor se všemi argumenty
@NoArgsConstructor // Generuje konstruktor bez argumentů
public class PersonStatisticsDTO {

    private long personId;
    private String personName;
    private long revenue;
    private long expenses;
}