package br.com.infoglobo.pool;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import neo.xredsys.api.IOAPI;
import neo.xredsys.api.ObjectLoader;
import neo.xredsys.api.Section;
import neo.xredsys.presentation.PresentationElement;
import neo.xredsys.presentation.PresentationLoader;
import neo.xredsys.presentation.PresentationPool;

import org.apache.commons.lang.StringUtils;
import org.junit.Rule;
import org.junit.Test;
import org.mockito.Mockito;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.rule.PowerMockRule;

import br.com.infoglobo.pool.WrappedPresentationPool.WrappedPresentationElement;

@PrepareForTest({ IOAPI.class })
public class WrappedPresentationPoolTest {
	@Rule
	public PowerMockRule rule = new PowerMockRule();
	
	@Test
	public void sessionIncludeComDuasAreasEAsDuasComNomeDaSessaoPreenchido() {
				
		WrappedPresentationElement wpe = carregaMocks("secaoA" , "secaoB" );			
				
		assertEquals(2, wpe.getItems().size());
	}	
	
	@Test
	public void sessionIncludeComDuasAreasEUmaComNomeDaSessaoVazioEOutraNao() {
		
		WrappedPresentationElement wpe = carregaMocks(StringUtils.EMPTY , "secaoB" );
		
		assertEquals(1, wpe.getItems().size());
	}
	
	@Test
	public void sessionIncludeComDuasAreasEUmaComNomeDaSessaoNulaEOutraNao() {
		
		WrappedPresentationElement wpe = carregaMocks(null , "secaoB" );
		
		assertEquals(1, wpe.getItems().size());
	}
	
	@Test
	public void sessionIncludeComDuasAreasEUmaComNomeDasSessoesNulas() {
		
		WrappedPresentationElement wpe = carregaMocks(null , null );
		
		assertEquals(0, wpe.getItems().size());
	}
	
	@Test
	public void sessionIncludeComDuasAreasEUmaComAsDuascomONomeDaSessaoVazio() {
		
		WrappedPresentationElement wpe = carregaMocks(StringUtils.EMPTY , StringUtils.EMPTY );
				
		assertEquals(0, wpe.getItems().size());
	}
	
	
	@SuppressWarnings("unchecked")
    private WrappedPresentationElement carregaMocks(String nomeSectionIncludeA, String nomeSectionIncludeB) {

	    PresentationPool poolMock = mock(PresentationPool.class);
		
		PresentationLoader loaderMock = mock(PresentationLoader.class);
		
		String includeSectionId = "esportes";
		String includeSectionPoolId = "principal/grupoA";
		WrappedPresentationPool wpp = new WrappedPresentationPool(poolMock , loaderMock, includeSectionId, includeSectionPoolId);

		PresentationElement element = mock(PresentationElement.class);
		
		WrappedPresentationPool parentPool = mock(WrappedPresentationPool.class);
		
		WrappedPresentationElement wpe = wpp.new WrappedPresentationElement(element, parentPool);
		
		Map<String, PresentationElement> areasMock = mock(Map.class);
		when(element.getAreas()).thenReturn(areasMock);
		List<PresentationElement> itensMock = new ArrayList<PresentationElement>();
		PresentationElement presentationElementMockA = mock(PresentationElement.class);
		PresentationElement presentationElementMockB = mock(PresentationElement.class);
		itensMock.add(presentationElementMockA);
		itensMock.add(presentationElementMockB);
		
		when(element.getItems()).thenReturn(itensMock);
		
		when(presentationElementMockA.getType()).thenReturn("INCLUDE_REF");
		when(presentationElementMockB.getType()).thenReturn("INCLUDE_REF");
		
		Map<String, Object> mapaA = mock(Map.class);
		when(presentationElementMockA.getOptions()).thenReturn(mapaA);
		when(mapaA.get(Mockito.anyString())).thenReturn(nomeSectionIncludeA);
		
		Map<String, Object> mapaB = mock(Map.class);
		when(presentationElementMockB.getOptions()).thenReturn(mapaB);
		when(mapaB.get(Mockito.anyString())).thenReturn(nomeSectionIncludeB);
		
		Section sectionAMock = Mockito.mock(Section.class);
		when(sectionAMock.getOwnerPublicationId()).thenReturn(1);
		when(sectionAMock.getName()).thenReturn(nomeSectionIncludeA);
		
		Section sectionBMock = Mockito.mock(Section.class);
		when(sectionBMock.getOwnerPublicationId()).thenReturn(1);
		when(sectionBMock.getName()).thenReturn(nomeSectionIncludeB);
		
		ObjectLoader objectLoaderMock = Mockito.mock(ObjectLoader.class);
		
		when(objectLoaderMock.getSectionByUniqueName(Mockito.anyInt(), Mockito.anyString())).thenReturn(sectionAMock);
		
		when(objectLoaderMock.getSectionByUniqueName(Mockito.anyInt(), Mockito.anyString())).thenReturn(sectionBMock);
		
		IOAPI ioapiMock = Mockito.mock(IOAPI.class);
		when(ioapiMock.getObjectLoader()).thenReturn(objectLoaderMock);
		
		PowerMockito.mockStatic(IOAPI.class);
		when(IOAPI.getAPI()).thenReturn(ioapiMock);
		
		when(parentPool.getPreviewIncludeSectionId()).thenReturn(1);
		
		when(parentPool.getPreviewIncludeSectionPoolId()).thenReturn(1);
		
		
		when(sectionAMock.getId()).thenReturn(1);
		when(sectionBMock.getId()).thenReturn(1);
		
		//Adiciona Elementos na Area A 
		PresentationPool poolAMock = mock(PresentationPool.class);
		
		when(loaderMock.getPool( Mockito.anyInt(), Mockito.anyInt(), Mockito.anyInt())).thenReturn(poolAMock);
		
		PresentationElement areaA = mock(PresentationElement.class);
		
		PresentationElement rootElementMock = mock(PresentationElement.class);
		Collection<PresentationElement> valuesMock = mock(Collection.class);		
		Iterator<PresentationElement> iteratorMock = mock(Iterator.class);
		when(poolAMock.getRootElement()).thenReturn(rootElementMock);
		
		Map<String, PresentationElement> mapaMock = mock(Map.class);
		when(rootElementMock.getAreas()).thenReturn(mapaMock);
		when(mapaMock.values()).thenReturn(valuesMock );		
		when(poolAMock.getRootElement().getAreas().values().iterator()).thenReturn(iteratorMock);
		when(poolAMock.getRootElement().getAreas().values().iterator().next()).thenReturn(areaA);	
		
		List<PresentationElement> areaAItens = new ArrayList<PresentationElement>();
		PresentationElement presentationElementA = mock(PresentationElement.class);
		areaAItens.add(presentationElementA);
		when(areaA.getItems()).thenReturn(areaAItens);
		
		//Adiciona Elementos na Area B 
		PresentationPool poolBMock = mock(PresentationPool.class);
		
		when(loaderMock.getPool( Mockito.anyInt(), Mockito.anyInt(), Mockito.anyInt())).thenReturn(poolBMock);
		
		PresentationElement areaB = mock(PresentationElement.class);
		
		PresentationElement rootElementBMock = mock(PresentationElement.class);
		Collection<PresentationElement> valuesBMock = mock(Collection.class);		
		Iterator<PresentationElement> iteratorBMock = mock(Iterator.class);
		when(poolBMock.getRootElement()).thenReturn(rootElementBMock);
		
		Map<String, PresentationElement> mapaBMock = mock(Map.class);
		when(rootElementBMock.getAreas()).thenReturn(mapaBMock);
		when(mapaBMock.values()).thenReturn(valuesBMock );		
		when(poolBMock.getRootElement().getAreas().values().iterator()).thenReturn(iteratorBMock);
		when(poolBMock.getRootElement().getAreas().values().iterator().next()).thenReturn(areaB);	
		
		List<PresentationElement> areaBItens = new ArrayList<PresentationElement>();
		PresentationElement presentationElementB = mock(PresentationElement.class);
		areaBItens.add(presentationElementB);
		when(areaB.getItems()).thenReturn(areaBItens);
	    return wpe;
    }
	
	
	

}
