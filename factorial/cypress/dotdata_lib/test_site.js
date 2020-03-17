//-----------------------------------------------------------------------------
// TestSite implements generic helper methods and utilities to facilitate test
// implementation for the workflows and functionality of a website.  This class
// works as a central library to group together similar helper methods.  New 
// methods can be added to this class in the future to expand it if needed.
// New classes can also be added if a new set of helper methods temperamentally
// different from the current set is needed. 
// To use this class, the test must import it:
//    import {TestSite} from '<relative dir>/dotdata_lib/test_site.js'
//-----------------------------------------------------------------------------

export class TestSite {

  //---------------------------------------------------------------------------
  // Setting the url in the constructor.
  //---------------------------------------------------------------------------
  constructor(url) {
    this.url = url
  }

  //---------------------------------------------------------------------------
  // Visit the url.
  //---------------------------------------------------------------------------
  visitUrl() {
    cy.visit(this.url)
  }

  //---------------------------------------------------------------------------
  // Reload the url.
  //---------------------------------------------------------------------------
  reloadUrl() {
    cy.reload()
  }

  //---------------------------------------------------------------------------
  // Verify the page title using the Chai-style assertion:
  // should(op) if strArray==null
  // should(op, str) if strArray is an array of strs; should(op, str) will go
  // through each str in the array.
  //---------------------------------------------------------------------------
  verifyTitle(op, strArray) {
    var title = cy.title()
    if (strArray == null)
      title.should(op)
    else
      strArray.forEach(s => title.should(op, s))  
  } 

  //--------------------------------------------------------------------------
  // Verify the headings using the Chai-style assertion:
  // should(op) if strArray==null
  // should(op, str) if strArray is an array of strs; should(op, str) will go
  // through each str in the array.
  //-------------------------------------------------------------------------- 
  verifyHeadings(op, strArray) { 
    var headings = cy.get('h1,h2,h3,h4,h5,h6')
    if (strArray == null)
      headings.should(op)
    else
      strArray.forEach(s => headings.should(op, s))
  }

  //--------------------------------------------------------------------------
  // Input a value, click on the submit button, and verify the result using 
  // the Chai-style assertion:
  // should(op) if strArray==null
  // should(op, str) if strArray is an array of strs; should(op, str) will go
  // through each str in the array.
  //--------------------------------------------------------------------------
  inputValueAndVerifyResult(val, op, strArray) {
    cy.get('input:first').as('inputField').type(val)
    cy.get('button').click()
    var result = cy.get('#resultDiv')
    if (strArray == null) 
      result.should(op)
    else
      strArray.forEach(s => result.should(op, s)) 
    cy.get('@inputField').clear()
  }

  //--------------------------------------------------------------------------
  // Click on a link and verify the destination url using the Chai-style 
  // assertion:
  // should(op) if strArray==null
  // should(op, str) if strArray is an array of strs; should(op, str) will go
  // through each str in the array.
  //--------------------------------------------------------------------------
  clickLinkAndVerifyUrl(link, op, strArray) {
    cy.get('a[href]').contains(link).click()
    if (strArray == null)
      cy.url().should(op)
    else
      strArray.forEach(s => cy.url().should(op, s))
  }

  //--------------------------------------------------------------------------
  // Check a link without clicking on it.  Verify the destination url using 
  // the Chai-style assertion:
  // should(op) if strArray==null
  // should(op, str) if strArray is an array of strs; should(op, str) will go
  // through each str in the array.
  //--------------------------------------------------------------------------
  checkLinkAndVerifyUrl(link, op, strArray) {
    var href = cy.get('a[href]').contains(link)
    href.should('have.attr', 'href')
    if (strArray == null)
      href.should(op)
    else
      strArray.forEach(s => href.should(op, s))
  }
}
