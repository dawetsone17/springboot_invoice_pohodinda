package cz.itnetwork.entity;

import cz.itnetwork.constant.Countries;
import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.ListAttribute;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(PersonEntity.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class PersonEntity_ {

	
	/**
	 * @see cz.itnetwork.entity.PersonEntity#zip
	 **/
	public static volatile SingularAttribute<PersonEntity, String> zip;
	
	/**
	 * @see cz.itnetwork.entity.PersonEntity#bankCode
	 **/
	public static volatile SingularAttribute<PersonEntity, String> bankCode;
	
	/**
	 * @see cz.itnetwork.entity.PersonEntity#country
	 **/
	public static volatile SingularAttribute<PersonEntity, Countries> country;
	
	/**
	 * @see cz.itnetwork.entity.PersonEntity#note
	 **/
	public static volatile SingularAttribute<PersonEntity, String> note;
	
	/**
	 * @see cz.itnetwork.entity.PersonEntity#mail
	 **/
	public static volatile SingularAttribute<PersonEntity, String> mail;
	
	/**
	 * @see cz.itnetwork.entity.PersonEntity#hidden
	 **/
	public static volatile SingularAttribute<PersonEntity, Boolean> hidden;
	
	/**
	 * @see cz.itnetwork.entity.PersonEntity#city
	 **/
	public static volatile SingularAttribute<PersonEntity, String> city;
	
	/**
	 * @see cz.itnetwork.entity.PersonEntity#purchases
	 **/
	public static volatile ListAttribute<PersonEntity, InvoiceEntity> purchases;
	
	/**
	 * @see cz.itnetwork.entity.PersonEntity#taxNumber
	 **/
	public static volatile SingularAttribute<PersonEntity, String> taxNumber;
	
	/**
	 * @see cz.itnetwork.entity.PersonEntity#telephone
	 **/
	public static volatile SingularAttribute<PersonEntity, String> telephone;
	
	/**
	 * @see cz.itnetwork.entity.PersonEntity#accountNumber
	 **/
	public static volatile SingularAttribute<PersonEntity, String> accountNumber;
	
	/**
	 * @see cz.itnetwork.entity.PersonEntity#sales
	 **/
	public static volatile ListAttribute<PersonEntity, InvoiceEntity> sales;
	
	/**
	 * @see cz.itnetwork.entity.PersonEntity#street
	 **/
	public static volatile SingularAttribute<PersonEntity, String> street;
	
	/**
	 * @see cz.itnetwork.entity.PersonEntity#iban
	 **/
	public static volatile SingularAttribute<PersonEntity, String> iban;
	
	/**
	 * @see cz.itnetwork.entity.PersonEntity#name
	 **/
	public static volatile SingularAttribute<PersonEntity, String> name;
	
	/**
	 * @see cz.itnetwork.entity.PersonEntity#identificationNumber
	 **/
	public static volatile SingularAttribute<PersonEntity, String> identificationNumber;
	
	/**
	 * @see cz.itnetwork.entity.PersonEntity#id
	 **/
	public static volatile SingularAttribute<PersonEntity, Long> id;
	
	/**
	 * @see cz.itnetwork.entity.PersonEntity
	 **/
	public static volatile EntityType<PersonEntity> class_;

	public static final String ZIP = "zip";
	public static final String BANK_CODE = "bankCode";
	public static final String COUNTRY = "country";
	public static final String NOTE = "note";
	public static final String MAIL = "mail";
	public static final String HIDDEN = "hidden";
	public static final String CITY = "city";
	public static final String PURCHASES = "purchases";
	public static final String TAX_NUMBER = "taxNumber";
	public static final String TELEPHONE = "telephone";
	public static final String ACCOUNT_NUMBER = "accountNumber";
	public static final String SALES = "sales";
	public static final String STREET = "street";
	public static final String IBAN = "iban";
	public static final String NAME = "name";
	public static final String IDENTIFICATION_NUMBER = "identificationNumber";
	public static final String ID = "id";

}

