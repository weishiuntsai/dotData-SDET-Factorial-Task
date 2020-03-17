// Import the helper methods in the TestSite class.
import {TestSite} from '../dotdata_lib/test_site.js'

describe('Factorial Calculator Test', function() {

  var ts

  //--------------------------------------------------------------------------
  // Hook to be executed once before all tests.
  //--------------------------------------------------------------------------
  before(function() {
    // Initiate the TestSite class to access its helper methods.
    ts = new TestSite('http://qainterview.pythonanywhere.com/')
  })  

  //--------------------------------------------------------------------------
  // Hook to be executed before each test.
  //--------------------------------------------------------------------------
  beforeEach(function() {
    // Some tests would click to a different page.  Revisit this page prior
    // to running each test.
    ts.visitUrl()
  })

  //--------------------------------------------------------------------------
  // Verify that the title is correct.
  //--------------------------------------------------------------------------
  it('Page Title', function() {
    // The title must be 'Factorial' according to the spec.
    ts.verifyTitle('eq', ['Factorial'])
  })

  //--------------------------------------------------------------------------
  // Verify that the heading exists in the page.
  //--------------------------------------------------------------------------
  it('Heading', function() {
    // Must have this heading 'The greatest factorial calculator!'
    ts.verifyHeadings('contain', ['The greatest factorial calculator!'])
  })

  //--------------------------------------------------------------------------
  // Verify that the factorial value is correct if the input is a supported
  // integer value within the range (0-170).
  //--------------------------------------------------------------------------
  it('Calculator with supported integer values', function() {

    // return the BigInt factorial of n 
    function factorialize(n) {
      var num = parseInt(n, 10)
      var result = BigInt(1)

      for (var i = 2; i <= num; i++)
        result = result * BigInt(i)

      return result
    }

    // A factorial result longer than 20 digits (the result of n! where n>=22)
    // is displayed by the calculator in the scientific notation.  The 
    // calculator displays the scale (part after '.') in the significant with a 
    // maximum of 16 digits. Currently the value may not always be consistent
    // or correct. This test is designed to be adjustable so that a user
    // can work around some of the issues and continue the testing.  The scale 
    // below can be adjusted to match only the leading number of digits in the
    // scale, and roundUp can be used to specify whether the last digit should
    // be rounded up or not.  With the current calculator design, all supported
    // values (0-170) would pass with scale=13 and roundUp=false.

    // scale should be between 1-16
    const scale = 16
    // true to round up the last digit
    const roundUp = true
    var inVal

    // Testing all supported integer values is viable only for a one-time 
    // testing.  In a recurrent testing environment, only boundary values and 
    // a few samples in the middle are tested here.  To test the entire set, 
    // replace the following for loop with:
    //   for (inVal = 0; inVal <= 170; inVal++) {

    var values = ['-0', '0', '01', '1', '2', '22', '23', '24', '25', '26', '31', '42', '78', '105', '00125', '135', '168', '0000169', '170']
    for (inVal of values) {
      var bigIntStr = factorialize(inVal).toString()
      var expectValStr1
      var expectValStr2 

      if (bigIntStr.length <= 20) {
        // non-scientific notation
        expectValStr1 = bigIntStr
        expectValStr2 = ''
      } else {
        // scientific notation

        // significant
        expectValStr1 = bigIntStr.charAt(0) + '.' + bigIntStr.substr(1, scale-1)
        // Round up the last digit if roundUp==true
        if (roundUp && parseInt(bigIntStr.charAt(scale+1)) >= 5)
          expectValStr1 += (parseInt(bigIntStr.charAt(scale))+1).toString()
        else
          expectValStr1 += bigIntStr.charAt(scale)

        // order of magnitude
        expectValStr2 = 'e+' + (bigIntStr.length - 1).toString()
      }

      // Input the value, click the button, and verify the result.
      ts.inputValueAndVerifyResult(inVal, 'contain',
        ['The factorial of ' + inVal + ' is: ', expectValStr1, expectValStr2])
    }
  })

  //--------------------------------------------------------------------------
  // Verify that integer values outside of the supported range (0-170) 
  // return errors.
  // NOTE: The spec doesn't indicate what error should be returned in this
  // situation.  This test may need to be updated once that's clarified.
  //--------------------------------------------------------------------------
  it('Calculator with integer values outside of supported range', function() {
    var inVal

    // All integer values between 171-989 currently return 
    // 'The factorial of <num> is: Infinity'.  The spec doesn't indicate what
    // error should be returned in this situation.  This test may need to be
    // updated once that's clarified.
    for (inVal of ['171', '989']) {
      ts.inputValueAndVerifyResult(inVal, 'contain', 
        ['factorial of ' + inVal + ' is: Infinity'])
    }

    // Integer values >= 990 or integer values < 0 currently do not have any 
    // effect, i.e. on a freshly reloaded page with no display from a prior 
    // calculation, it displays nothing.  The spec doesn't indicate what error
    // should be returned in this situation.  This test may need to be updated
    // once that's clarified.
    for (inVal of ['990', '10000000000', '-1', '-10000000000']) {
      // This test requires reloading the page each time to insure that
      // there is no leftover display from the previous test.
      ts.reloadUrl()
      ts.inputValueAndVerifyResult(inVal, 'not.have.text', null) 
    } 
  })

  //--------------------------------------------------------------------------
  // Verify that non-integer values return error messages.
  //--------------------------------------------------------------------------
  it('Calculator with non-integer values', function() {
    // Any invalid integer values expect to see 'Please enter an integer'.
    // This includes floating points, white space, special characters, among
    // others. 
    var values = [' ', '1.23', '-0.12345', 'ABC', '#', '-', '/', '\\', '0#', '1A']
    var inVal

    for (inVal of values) {
      // This test requires reloading the page each time to insure that
      // there is no leftover display from the previous test.
      ts.reloadUrl()
      ts.inputValueAndVerifyResult(inVal, 'contain', 
        ['Please enter an integer'])
    }
  })

  //-------------------------------------------------------------------------
  // Verify that the 'Terms and Conditions' link opens the correct page.
  //-------------------------------------------------------------------------
  it('Terms and Conditions', function() {
    ts.clickLinkAndVerifyUrl('Terms and Conditions', 'contain', ['/terms'])
  })

  //-------------------------------------------------------------------------
  // Verify that the 'Privacy' link opens the correct page.
  //-------------------------------------------------------------------------
  it('Privacy', function() {
    ts.clickLinkAndVerifyUrl('Privacy', 'contain', ['/privacy'])
  })

  //-------------------------------------------------------------------------
  // Verify that the 'Copyright' link points to the correct page.
  //-------------------------------------------------------------------------
  it('Copyright', function() {
    // The Copyright link goes to an external page, so the test only verifies 
    // the link instead of clicking on it.
    ts.checkLinkAndVerifyUrl('Qxf2 Services', 'contain', 
      ['https://www.qxf2.com/'])
  })
})
