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
      "url": "http://localhost/repository/versions"
    },
    {
      "type": "clickElement",
      "locator": {
        "type": "xpath",
        "value": "//div[@id='newobject']//button[.=' New version']"
      }
    },
    {
      "type": "setElementText",
      "locator": {
        "type": "id",
        "value": "versionTitle"
      },
      "text": "Demo version"
    },
    {
      "type": "setElementText",
      "locator": {
        "type": "id",
        "value": "token-input-artefacts"
      },
      "text": "demo"
    },
    {
      "type": "clickElement",
      "locator": {
        "type": "css selector",
        "value": ".token-input-dropdown-item2-facebook"
      }
    },
    {
      "type": "clickElement",
      "locator": {
        "type": "id",
        "value": "save-btn"
      }
    },
    {
      "type": "waitForElementPresent",
      "locator": {
        "type": "link text",
        "value": "Versions"
      }
    },
    {
      "type": "clickElement",
      "locator": {
        "type": "link text",
        "value": "Versions"
      }
    },
    {
      "type": "waitForElementPresent",
      "locator": {
        "type": "xpath",
        "value": "//div[@class='obj'][h4/a='Demo version '][contains(.,'(1 associated artefact)')]"
      }
    }
  ]
}