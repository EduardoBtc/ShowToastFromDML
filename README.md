# ShowToastFromTrigger - LWC Component

[![Salesforce](https://img.shields.io/badge/Salesforce-Lightning%20Web%20Component-00A1E0?style=flat&logo=salesforce)](https://developer.salesforce.com/docs/component-library/documentation/en/lwc)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0-blue.svg)](CHANGELOG.md)

> **🚀 An invisible Lightning Web Component that monitors field changes and displays toast notifications automatically using Change Data Capture (CDC)**

## 📋 Table of Contents

- [Overview](#-overview)
- [Technologies Used](#-technologies-used)
- [Requirements](#-requirements)
- [Installation](#-installation)
- [Quick Setup](#-quick-setup)
- [Configuration](#-configuration)
- [Available Merge Fields](#-available-merge-fields)
- [Common Use Cases](#-common-use-cases)
- [Troubleshooting](#-troubleshooting)
- [Known Limitations](#-known-limitations)
- [Performance](#-performance)
- [Contributing](#-contributing)
- [License](#-license)

## 📋 Overview

The **ShowToastFromTrigger** is an invisible Lightning Web Component that monitors changes to specific record fields and automatically displays toast notifications when the field is updated, regardless of the change source (Apex, Flow, UI, DML).

### ✨ Main Features

- 🔄 **Real-Time Monitoring**: Uses Change Data Capture (CDC) to detect changes instantly
- 🎨 **Fully Configurable**: Customize title, message, color, mode and behavior via App Builder
- 🔗 **Dynamic Merge Fields**: Use tokens like `{newValue}`, `{oldValue}`, `{recordId}` in messages
- 🔄 **Automatic Refresh**: Option to automatically refresh the page after displaying the toast
- 🐛 **Debug Mode**: Detailed logs for troubleshooting

## 🛠️ Technologies Used

- **Salesforce Lightning Web Components (LWC)** - Modern JavaScript framework for Salesforce
- **Change Data Capture (CDC)** - Real-time data change monitoring
- **Lightning App Builder** - Visual page configuration
- **Salesforce Platform Events** - Event-driven architecture
- **JavaScript ES6+** - Modern JavaScript features
- **CSS3** - Styling and animations
- **HTML5** - Semantic markup

## 📋 Requirements

### Prerequisites

- **Salesforce Org** with appropriate permissions
- **Change Data Capture** enabled (requires licensing)
- **Lightning App Builder** access
- **System Administrator** or **Customize Application** permission

### Salesforce Editions

| Edition | CDC Support | Object Limit |
|---------|-------------|--------------|
| Developer Edition | ✅ | 5 objects |
| Professional | ❌ | Not available |
| Enterprise | ✅ | 10 objects |
| Unlimited | ✅ | 20 objects |

## 🚀 Installation

### Deploy via SF CLI (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/EduardoBtc/showToastFromDML.git
   cd showToastFromDML
   ```

2. **Authenticate with Salesforce**
   ```bash
   sf org login web --set-default --alias myorg
   ```

3. **Deploy to your org**
   ```bash
   sf project deploy start --source-dir force-app/main/default/lwc/showToastFromDML
   ```


## 🚀 Quick Setup

### Step 1: Enable Change Data Capture

1. Go to **Setup** → **Change Data Capture**  
2. Select the object you want to monitor  
3. Click **Enable** to activate CDC

> **⚠️ Important**: CDC requires licensing and may be limited to 5 objects per org (Developer Edition)

### Step 2: Add Component to the Record Page

1. Open **Lightning App Builder**  
2. Edit the desired Record Page  
3. Drag the **Show Toast From DML** component into any region  
4. Configure the properties as needed

### Step 3: Configure Properties

The component offers a comprehensive set of configuration options organized by functionality:

#### 1️⃣ **BASIC CONFIG** (Required)

| Property | Description | Example |
|----------|-------------|---------|
| **Monitored Field** | API name of the field to monitor | `Status__c`, `ApprovalStatus__c` |

#### 2️⃣ **NOTIFICATION CONTENT** (Essential)

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| **Toast Title** | String | Title with automatic merge fields processing | "Notification" |
| **Toast Message** | String | Message with automatic merge fields processing | "Field was updated" |

> **✨ Automatic Processing**: The component automatically detects tokens like `{newValue}`, `{oldValue}`, `{recordId}`, `{objectName}` and replaces them with real values.

#### 3️⃣ **APPEARANCE** (Visual)

| Property | Type | Options | Description | Default |
|----------|------|---------|-------------|---------|
| **Notification Type** | Picklist | success/error/warning/info | Toast color and icon | "info" |
| **Display Mode** | Picklist | dismissable/pester/sticky | How the toast is closed | "dismissable" |

#### 4️⃣ **BEHAVIOR** (Functional)

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| **Force Page Refresh** | Boolean | If checked, refreshes the page after toast | false |
| **Refresh Delay (ms)** | Integer | Wait time before refresh | 1000 |
| **Show Only Once** | Boolean | Shows the toast only on the first change | false |

#### 5️⃣ **HELP** (Support)

| Property | Description |
|----------|-------------|
| **📋 Available Variables** | List of all dynamic variables |
| **📝 Usage Examples** | Practical examples of how to use the variables |
| **💡 Usage Tip** | Important tip for using the variables |

#### 6️⃣ **ADVANCED** (Technical)

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| **Debug Mode** | Boolean | Shows detailed logs in the console | false |

## 🔗 Available Merge Fields

Use these tokens in messages for dynamic values:

| Token | Description | Example |
|-------|-------------|---------|
| `{newValue}` | Current field value | "Approved" |
| `{oldValue}` | Previous field value | "Pending" |
| `{recordId}` | Record ID | "001XX000004DHPY" |
| `{objectName}` | Object name | "Account" |

### 📋 Built-in Help in the App Builder

The component includes a **built-in help property** that shows all available dynamic variables directly in the App Builder:

```
📋 AVAILABLE DYNAMIC VARIABLES:

🔹 {newValue} - Current field value
🔹 {oldValue} - Previous field value  
🔹 {recordId} - Record ID
🔹 {objectName} - Object name

📝 USAGE EXAMPLES:

Title: "Status Updated"
Message: "Field changed from {oldValue} to {newValue}"

Title: "Approval Completed!"
Message: "Record {recordId} was approved"

Title: "{objectName} Modified"
Message: "New value: {newValue}"

💡 TIP: Processing is automatic! Just use the tokens in messages.
```

**How to use:**
1. In App Builder, scroll to the "📋 Available Dynamic Variables" section
2. **Copy** the variables you want to use
3. **Paste** them in the title or message of the toast
4. **Done!** Processing is automatic - no need to activate anything

### 🎨 Visual Interface in the App Builder

```
┌─────────────────────────────────────────────┐
│ SHOW TOAST FROM TRIGGER                     │
├─────────────────────────────────────────────┤
│                                             │
│ Monitored Field *                            │
│ [Status__c                            ]     │
│                                             │
│ Toast Title                                  │
│ [Status Updated                       ]     │
│                                             │
│ Toast Message                               │
│ [Field changed from {oldValue} to {newValue}] │
│                                             │
│ ✨ Automatic Processing Active              │
│                                             │
│ ── 📋 HELP WITH VARIABLES ──               │
│                                             │
│ 📋 Available Variables                      │
│ [{newValue} - Current value | {oldValue}...] │
│                                             │
│ 📝 Usage Examples                           │
│ [Title: 'Status Updated' | Message...]      │
│                                             │
│ 💡 Usage Tip                               │
│ [Automatic processing - just use...]       │
│                                             │
│ ── Advanced Options ──                       │
│ ☐ Show Only Once                            │
│ ☐ Debug Mode                                │
│                                             │
└─────────────────────────────────────────────┘
```

### 📝 Merge Field Examples

```
Title: "Status Updated"
Message: "Field changed from {oldValue} to {newValue}"

Title: "Approval Completed!"
Message: "The record {recordId} was approved successfully."

Title: "{objectName} Modified"
Message: "New value: {newValue}"
```

## 🎯 Common Use Cases

### 1. Approval Notification

```
Monitored Field: ApprovalStatus__c
Title: Approval Completed!
Message: Status changed to {newValue}
Notification Type: success
Display Mode: pester
☑ Force Page Refresh: true
Refresh Delay: 2000
```

**Result**: Green toast "Approval Completed! Status changed to Approved", closes after 3s, then refreshes the page

### 2. Critical Error Alert

```
Monitored Field: ValidationError__c
Title: Validation Error
Message: {newValue}
Notification Type: error
Display Mode: sticky
☐ Force Page Refresh: false
```

**Result**: Red toast with the error message, stays on screen until the user closes it

### 3. Status Info with History

```
Monitored Field: Status
Title: {objectName} Updated
Message: Status changed from {oldValue} to {newValue}
Notification Type: info
Display Mode: dismissable
☐ Force Page Refresh: false
```

**Result**: Gray toast "Account Updated: Status changed from Open to Closed"

## 📖 Complete Example

Here's a complete example of setting up the component for an approval process:

### Scenario: Opportunity Approval Workflow

```javascript
// Component Configuration
{
  "monitoredField": "ApprovalStatus__c",
  "toastTitle": "Approval Status Updated",
  "toastMessage": "Opportunity {recordId} status changed from {oldValue} to {newValue}",
  "notificationType": "success",
  "displayMode": "pester",
  "forcePageRefresh": true,
  "refreshDelayMs": 2000,
  "showOnlyOnce": false,
  "debugMode": false
}
```

### Expected Behavior

1. **User updates** `ApprovalStatus__c` from "Pending" to "Approved"
2. **CDC detects** the change within 1-2 seconds
3. **Toast appears** with green success styling
4. **Message displays**: "Opportunity 006XX000004DHPY status changed from Pending to Approved"
5. **Page refreshes** after 2 seconds to show updated data

## 🔧 Troubleshooting

### ❌ Toast not appearing

**Possible causes:**
1. **CDC not enabled**: Verify Change Data Capture is active for the object  
2. **Wrong field**: Confirm the field API name is correct  
3. **Permissions**: User needs access to the monitored field  
4. **Debug Mode**: Enable to see detailed logs in the console

**Solution:**
```javascript
// Enable debug mode to see logs
debugMode: true
```

### ⏱️ Detection latency

**Cause**: CDC has a natural latency of ~1-2 seconds

**Solution**: This is normal—it's a platform limitation. For critical cases, consider Platform Events.

### 🔄 Refresh not working

**Possible causes:**
1. **Delay too low**: Increase the refresh delay  
2. **Browser**: Some browsers may block automatic refresh

**Solution:**
```javascript
// Increase the delay if needed
refreshDelayMs: 2000
```

### 📊 Multiple instances

**Problem**: Multiple toasts appear for the same field

**Solution**: Use only one instance of the component per page, or configure `showOnlyOnce: true`

## 🚨 Known Limitations

| Limitation | Description | Workaround |
|-----------|-------------|------------|
| **CDC Latency** | ~1-2 seconds delay | Platform limitation |
| **CDC Limit** | 5 objects per org (Dev Edition) | Upgrade license |

## 🔍 Debug Mode

Enable debug mode for advanced troubleshooting:

```javascript
// In App Builder, check:
Debug Mode: ☑
```

**Available logs:**
- Component initialization  
- Initial field values  
- Change detection  
- Merge fields processing  
- Toast display  
- View refresh  
- Errors and exceptions

## 📈 Performance

### ✅ Implemented Optimizations

- **CDC instead of polling**: Maximum efficiency  
- **RefreshApex**: Updates only necessary data  
- **Conditional logs**: Debug only when enabled  
- **Automatic cleanup**: Removes subscriptions on disconnect

### 📊 Resource Consumption

- **CPU**: Minimal (listening to events only)  
- **Memory**: Low (no active polling)  
- **Network**: CDC uses an efficient WebSocket connection   

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### What this means:

- ✅ **Commercial use** - Use in commercial projects
- ✅ **Modification** - Modify the code as needed
- ✅ **Distribution** - Share and distribute
- ✅ **Private use** - Use in private projects
- ❌ **Liability** - No warranty provided
- ❌ **Warranty** - No warranty provided


- **Documentation**: Check this README and inline comments
- **My Trailhead**: [Eduardo Martins](https://www.salesforce.com/trailblazer/emartins35)
---

<div align="center">

**⭐ If this component helped you, please give it a star! ⭐**

Made with ❤️ for the Salesforce community

</div>