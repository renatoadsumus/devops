package br.com.infoglobo.taglib;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.jsp.JspException;

import org.apache.log4j.Logger;

import br.com.infoglobo.statistics.InfogloboStatistics;
import br.com.infoglobo.statistics.PresentationStatisticsElement;

import com.escenic.analysis.common.util.ArrayUtil;
import com.escenic.analysis.common.util.StringUtil;

public class InfogloboStatisticsTag extends InfogloboStatisticsBaseTag
{
  /** Serial Version */
  private static final long serialVersionUID = -8607278151042890393L;

  private Object from;
  private Object to;
  private String sinceMinutesAgo;
  private String sinceHoursAgo;
  private Object pubId;
  private boolean includeContextPubId = true;
  private Object sectionId;
  private Object type;
  private Object meta;
  private Object category;
  private boolean includeRest = false;
  private String max;
  private boolean groupByPublication = true;

  private static Logger LOGGER = Logger.getLogger(InfogloboStatisticsTag.class);

  public int doEndTag() throws JspException
  {
    validate();

	InfogloboStatistics qs = getInfogloboStatistics();
	
	List<PresentationStatisticsElement> results = new ArrayList<PresentationStatisticsElement>();
	
    try {
//      if (this.from != null)
//        mp = pqm.getMostPopular((Date)this.from, (Date)this.to, Integer.parseInt(this.max), this.includeRest, (String[])(String[])this.type, (int[])(int[])this.sectionId, (int[])(int[])this.pubId, (String[])(String[])this.category, (String[])(String[])this.meta, 50, this.groupByPublication);
//      else {
		results = qs.getAsMais(Integer.parseInt(this.sinceHoursAgo), Integer.parseInt(this.sinceMinutesAgo), this.includeRest, getStringArray(this.type), (int[])this.sectionId, (int[])this.pubId, getStringArray(this.category),
				getStringArray(this.meta), 50, this.groupByPublication, Integer.parseInt(this.max));
//      }
      this.pageContext.setAttribute(getId(), results);
    } catch (Exception e) {
      LOGGER.error("Exception: " + e.getMessage(), e);
    }
    finally
    {
      reset();
    }
    return EVAL_PAGE;
  }
  
  public void release() {
    super.release();
    reset();
  }

  public Object getFrom() {
    return this.from;
  }

  public void setFrom(Object from) {
    this.from = from;
  }

  public Object getTo() {
    return this.to;
  }

  public void setTo(Object to) {
    this.to = to;
  }

  public String getSinceMinutesAgo() {
    return this.sinceMinutesAgo;
  }

  public void setSinceMinutesAgo(String sinceMinutesAgo) {
    this.sinceMinutesAgo = sinceMinutesAgo;
  }

  public String getSinceHoursAgo() {
    return this.sinceHoursAgo;
  }

  public void setSinceHoursAgo(String sinceHoursAgo) {
    this.sinceHoursAgo = sinceHoursAgo;
  }

  public String getMax() {
    return this.max;
  }

  public void setMax(String max) {
    this.max = max;
  }

  public Object getPubId() {
    return this.pubId;
  }

  public void setPubId(Object pubId) {
    this.pubId = pubId;
  }

  public boolean isIncludeContextPubId() {
    return this.includeContextPubId;
  }

  public void setIncludeContextPubId(boolean includeContextPubId) {
    this.includeContextPubId = includeContextPubId;
  }

  public Object getSectionId() {
    return this.sectionId;
  }

  public void setSectionId(Object sectionId) {
    this.sectionId = sectionId;
  }

  public Object getType() {
    return this.type;
  }

  public void setType(Object type) {
    this.type = type;
  }

  public Object getMeta() {
    return this.meta;
  }

  public void setMeta(Object meta) {
    this.meta = meta;
  }

  public Object getCategory() {
    return this.category;
  }

  public void setCategory(Object category) {
    this.category = category;
  }

  public boolean isIncludeRest() {
    return this.includeRest;
  }

  public void setIncludeRest(boolean includeRest) {
    this.includeRest = includeRest;
  }

  public boolean isGroupByPublication() {
    return this.groupByPublication;
  }

  public void setGroupByPublication(boolean groupByPublication) {
    this.groupByPublication = groupByPublication;
  }

  private void reset() {
    this.pubId = null;
  }

  private void validate() throws JspException
  {
    if ((this.max == null) || (this.max.trim().equals("")))
      this.max = "10";
    else if (!(StringUtil.isNumeric(this.max))) {
      throw new JspException("The attibute 'max' must be a number");
    }

    if ((this.from == null) && (this.sinceHoursAgo == null) && (this.sinceMinutesAgo == null))
      throw new JspException("Missing attributes 'from' or ('sinceHoursAgo' and/or 'sinceMinutesAgo').");
    if ((((this.from != null) || (this.to != null))) && (((this.sinceHoursAgo != null) || (this.sinceMinutesAgo != null)))) {
      throw new JspException("Attributes 'from' and 'to' cannot be combined with attributes 'sinceHoursAgo' and 'sinceMinutesAgo'.");
    }

    if ((this.sinceHoursAgo != null) && (!(StringUtil.isNumeric(this.sinceHoursAgo)))) {
      throw new JspException("The attribute 'sinceHoursAgo must be a number.");
    }
    if ((this.sinceMinutesAgo != null) && (!(StringUtil.isNumeric(this.sinceMinutesAgo)))) {
      throw new JspException("The attribute 'sinceMinutesAgo must be a number.");
    }
    if ((this.from != null) && (!(this.from instanceof Date))) {
      throw new JspException("The attribute 'from' must of type java.util.Date");
    }
    if ((this.to != null) && (!(this.to instanceof Date))) {
      throw new JspException("The attribute 'to' must of type java.util.Date");
    }
    if (this.from == null) {
      if ((this.sinceHoursAgo == null) || (this.sinceHoursAgo.trim().equals(""))) {
        this.sinceHoursAgo = "0";
      }
      if ((this.sinceMinutesAgo == null) || (this.sinceMinutesAgo.trim().equals(""))) {
        this.sinceMinutesAgo = "0";
      }

    }

    if (this.pubId != null)
    {
      if (this.pubId instanceof Integer) {
        this.pubId = new int[] { ((Integer)this.pubId).intValue() }; } else {
        if ((this.pubId instanceof String) && (((String)this.pubId).trim().equals("")))
          throw new JspException("The attribute 'pubId' must be a number (int/Integer, comma separated String or an int[].");
        if (this.pubId instanceof String)
          this.pubId = StringUtil.convertStringToIntArray((String)this.pubId);  }
    }
    if ((!(this.pubId instanceof int[])) || (
      (this.includeContextPubId) && (this.pageContext.getRequest().getAttribute("publication") != null))) {
      Object pub = this.pageContext.getRequest().getAttribute("publication");
      int[] contextPubId = null;
      try {
        Class className = Class.forName("neo.xredsys.api.Publication");
        Method method = className.getMethod("getId", null);
        contextPubId = new int[] { ((Integer)method.invoke(pub, null)).intValue() };
        this.pubId = ArrayUtil.mergeIntArrays(contextPubId, (int[])(int[])this.pubId);
      } catch (Exception e) {
        System.out.println("Exception occured in MostPopularTag: " + e.getMessage());
      }

    }

    if (this.sectionId != null)
    {
      if (this.sectionId instanceof Integer) {
        this.sectionId = new int[] { ((Integer)this.sectionId).intValue() }; } else {
        if ((this.sectionId instanceof String) && (((String)this.sectionId).trim().equals("")))
          throw new JspException("The attribute 'sectionId' must be a number (int/Integer, comma separated String or an int[].");
        if (this.sectionId instanceof String)
          this.sectionId = StringUtil.convertStringToIntArray((String)this.sectionId);  }
    }
    if ((this.sectionId instanceof int[]) && 
      (this.type != null))
    {
      if ((this.type instanceof String) && (((String)this.type).trim().equals("")))
        throw new JspException("The attribute 'type' was empty, but must be a String (comma separated) or a String[].");
      if (this.type instanceof String)
        this.type = StringUtil.convertCsvStringToStringArray((String)this.type); 
    }
    if ((this.type instanceof String[]) && 
      (this.meta != null))
    {
      if ((this.meta instanceof String) && (((String)this.meta).trim().equals("")))
        throw new JspException("The attribute 'meta' was empty, but must be a String (comma separated) or a String[].");
      if (this.meta instanceof String)
        this.meta = StringUtil.convertCsvStringToStringArray((String)this.meta); 
    }
    if ((!(this.meta instanceof String[])) || 
      (this.category == null))
      return;
    if ((this.category instanceof String) && (((String)this.category).trim().equals("")))
      throw new JspException("The attribute 'category' was empty, but must be a String (comma separated) or a String[].");
    if (this.category instanceof String)
      this.category = StringUtil.convertCsvStringToStringArray((String)this.category);
    else if (!(this.category instanceof String[]))
      return;
  }
}