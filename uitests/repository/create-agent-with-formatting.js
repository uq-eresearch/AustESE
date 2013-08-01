{
  "type": "script",
  "seleniumVersion": "2",
  "formatVersion": 1,
  "steps": [
    {
      "type": "get",
      "url": "http://localhost/"
    },
    {
      "type": "clickElement",
      "locator": {
        "type": "link text",
        "value": "Log in"
      }
    },
    {
      "type": "clickElement",
      "locator": {
        "type": "link text",
        "value": "Log in using username/password"
      }
    },
    {
      "type": "waitForTextPresent",
      "text": "Username"
    },
    {
      "type": "setElementText",
      "locator": {
        "type": "id",
        "value": "edit-name"
      },
      "text": "demo"
    },
    {
      "type": "setElementText",
      "locator": {
        "type": "id",
        "value": "edit-pass"
      },
      "text": "demo"
    },
    {
      "type": "clickElement",
      "locator": {
        "type": "id",
        "value": "edit-submit"
      }
    },
    {
      "type": "get",
      "url": "http://localhost/repository/agents"
    },
    {
      "type": "clickElement",
      "locator": {
        "type": "xpath",
        "value": "//div[@id='newobject']//button[.=' New agent']"
      }
    },
    {
      "type": "setElementText",
      "locator": {
        "type": "id",
        "value": "lastName"
      },
      "text": "A"
    },
    {
      "type": "setElementText",
      "locator": {
        "type": "id",
        "value": "firstName"
      },
      "text": "Person"
    },
    {
      "type": "waitForElementPresent",
      "locator": {
        "type": "xpath",
        "value": "//ul[@class='wysihtml5-toolbar']//a[.='Bold']"
      }
    },
    {
      "type": "setElementSelected",
      "locator": {
        "type": "xpath",
        "value": "//div[@class='invisi-well']/fieldset/div[3]/div/iframe"
      }
    },
    {
      "type": "clickElement",
      "locator": {
        "type": "link text",
        "value": "Bold"
      }
    },
    {
      "type": "setElementText",
      "locator": {
        "type": "css selector",
        "value": "iframe.wysihtml5-sandbox"
      },
      "text": "Demo agent biography"
    },
    {
      "type": "clickElement",
      "locator": {
        "type": "id",
        "value": "save-btn"
      }
    },
    {
      "type": "clickElement",
      "locator": {
        "type": "link text",
        "value": "Agents"
      }
    },
    {
      "type": "waitForTextPresent",
      "text": "A, Person"
    }
  ]
}