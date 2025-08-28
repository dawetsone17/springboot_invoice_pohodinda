package cz.itnetwork.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.LocalDate;

@StaticMetamodel(InvoiceEntity.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class InvoiceEntity_ {

	
	/**
	 * @see cz.itnetwork.entity.InvoiceEntity#seller
	 **/
	public static volatile SingularAttribute<InvoiceEntity, PersonEntity> seller;
	
	/**
	 * @see cz.itnetwork.entity.InvoiceEntity#note
	 **/
	public static volatile SingularAttribute<InvoiceEntity, String> note;
	
	/**
	 * @see cz.itnetwork.entity.InvoiceEntity#product
	 **/
	public static volatile SingularAttribute<InvoiceEntity, String> product;
	
	/**
	 * @see cz.itnetwork.entity.InvoiceEntity#deleted
	 **/
	public static volatile SingularAttribute<InvoiceEntity, Boolean> deleted;
	
	/**
	 * @see cz.itnetwork.entity.InvoiceEntity#price
	 **/
	public static volatile SingularAttribute<InvoiceEntity, Long> price;
	
	/**
	 * @see cz.itnetwork.entity.InvoiceEntity#dueDate
	 **/
	public static volatile SingularAttribute<InvoiceEntity, LocalDate> dueDate;
	
	/**
	 * @see cz.itnetwork.entity.InvoiceEntity#invoiceNumber
	 **/
	public static volatile SingularAttribute<InvoiceEntity, String> invoiceNumber;
	
	/**
	 * @see cz.itnetwork.entity.InvoiceEntity#vat
	 **/
	public static volatile SingularAttribute<InvoiceEntity, Integer> vat;
	
	/**
	 * @see cz.itnetwork.entity.InvoiceEntity#id
	 **/
	public static volatile SingularAttribute<InvoiceEntity, Long> id;
	
	/**
	 * @see cz.itnetwork.entity.InvoiceEntity#issued
	 **/
	public static volatile SingularAttribute<InvoiceEntity, LocalDate> issued;
	
	/**
	 * @see cz.itnetwork.entity.InvoiceEntity
	 **/
	public static volatile EntityType<InvoiceEntity> class_;
	
	/**
	 * @see cz.itnetwork.entity.InvoiceEntity#buyer
	 **/
	public static volatile SingularAttribute<InvoiceEntity, PersonEntity> buyer;

	public static final String SELLER = "seller";
	public static final String NOTE = "note";
	public static final String PRODUCT = "product";
	public static final String DELETED = "deleted";
	public static final String PRICE = "price";
	public static final String DUE_DATE = "dueDate";
	public static final String INVOICE_NUMBER = "invoiceNumber";
	public static final String VAT = "vat";
	public static final String ID = "id";
	public static final String ISSUED = "issued";
	public static final String BUYER = "buyer";

}

