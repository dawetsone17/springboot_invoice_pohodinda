package cz.itnetwork.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PersonStatisticsDTO {

    private Long personId;
    private String name;
    private long revenue;
    private long expenses;
}