import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  LayoutDashboard, ScanBarcode, BookUser, Boxes, LineChart as LineChartIcon,
  Settings, Mic, Search, Plus, Minus, Trash2, IndianRupee, Wifi, WifiOff,
  Sun, Moon, Globe, X, CreditCard, Wallet, QrCode, MessageCircle, Printer,
  AlertTriangle, TrendingUp, TrendingDown, PackageX, CalendarClock, Star,
  ChevronRight, CheckCircle2, Clock, Filter, ArrowUpDown, FileDown, Bell,
  Users, Percent, PackagePlus, Package, ShoppingCart, KeyRound
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";

/* ============================================================================
   RetailCore — Kirana Micro-ERP / Smart POS / Udhaar Ledger / AI Analytics
   Single-file React demo. All data lives in memory (no backend attached).
   ========================================================================== */

/* ---------------------------- Seeded RNG --------------------------------- */
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(20260806);
const pick = (arr) => arr[Math.floor(rng() * arr.length)];
const randInt = (min, max) => Math.floor(rng() * (max - min + 1)) + min;

/* ---------------------------- i18n dictionary ----------------------------- */
const DICT = {
  en: {
    dashboard: "Dashboard", pos: "POS Billing", inventory: "Inventory", udhaar: "Udhaar Ledger",
    analytics: "Analytics Hub", settings: "Settings", todaysRevenue: "Today's Revenue",
    todaysProfit: "Today's Profit", cashInUdhaar: "Cash Locked in Udhaar", projectedMonthly: "Projected Monthly Earnings",
    searchPlaceholder: "Search by name, brand or scan barcode…", speak: "Speak", cart: "Cart",
    subtotal: "Subtotal", gst: "GST", total: "Total", checkout: "Checkout", cash: "Cash", upi: "UPI",
    credit: "Udhaar", empty: "Cart is empty — search or scan to add items", lowStock: "Low Stock",
    expiringSoon: "Expiring Soon", fastMoving: "Fast Moving", allItems: "All Items", category: "Category",
    stock: "Stock", margin: "Margin", reorder: "Generate Purchase Order", customers: "Customers",
    addCustomer: "Add Customer", trustLevel: "Trust Level", creditLimit: "Credit Limit", balance: "Balance",
    sendReminder: "Send Reminder", recordPayment: "Record Payment", overdue: "Overdue", ok: "Good Standing",
    watching: "Watching", online: "Online", offline: "Offline", darkMode: "Dark Mode", language: "Language",
    hourlySales: "Hourly Sales Distribution", categoryProfit: "Category Profit Heatmap",
    topMovers: "Fast-Moving vs Dead Stock", storeName: "Store Name", ownerName: "Owner Name",
    receipt: "Receipt", print: "Print", whatsapp: "Send via WhatsApp", close: "Close",
    profit: "Net Profit", qty: "Qty", price: "Price", name: "Name", phone: "Phone", addToCart: "Add",
    outOfStock: "Out of stock", available: "available", transactionComplete: "Transaction Complete",
    shortcuts: "Shortcuts", billing: "Billing (F2)", customerSearch: "Customer Search (F4)",
  },
  hi: {
    dashboard: "डैशबोर्ड", pos: "पीओएस बिलिंग", inventory: "इन्वेंटरी", udhaar: "उधार बही",
    analytics: "एनालिटिक्स हब", settings: "सेटिंग्स", todaysRevenue: "आज की बिक्री",
    todaysProfit: "आज का लाभ", cashInUdhaar: "उधार में फंसी राशि", projectedMonthly: "अनुमानित मासिक कमाई",
    searchPlaceholder: "नाम, ब्रांड खोजें या बारकोड स्कैन करें…", speak: "बोलें", cart: "कार्ट",
    subtotal: "उप-योग", gst: "जीएसटी", total: "कुल", checkout: "भुगतान करें", cash: "नकद", upi: "यूपीआई",
    credit: "उधार", empty: "कार्ट खाली है — खोजें या स्कैन करें", lowStock: "कम स्टॉक",
    expiringSoon: "जल्द समाप्त", fastMoving: "तेज़ बिकने वाले", allItems: "सभी वस्तुएं", category: "श्रेणी",
    stock: "स्टॉक", margin: "मार्जिन", reorder: "खरीद आदेश बनाएं", customers: "ग्राहक",
    addCustomer: "ग्राहक जोड़ें", trustLevel: "विश्वास स्तर", creditLimit: "उधार सीमा", balance: "बकाया",
    sendReminder: "याद दिलाएं", recordPayment: "भुगतान दर्ज करें", overdue: "अतिदेय", ok: "ठीक",
    watching: "नज़र रखें", online: "ऑनलाइन", offline: "ऑफ़लाइन", darkMode: "डार्क मोड", language: "भाषा",
    hourlySales: "घंटेवार बिक्री", categoryProfit: "श्रेणी लाभ मानचित्र",
    topMovers: "तेज़ बनाम धीमी बिक्री", storeName: "दुकान का नाम", ownerName: "मालिक का नाम",
    receipt: "रसीद", print: "प्रिंट करें", whatsapp: "व्हाट्सएप भेजें", close: "बंद करें",
    profit: "शुद्ध लाभ", qty: "मात्रा", price: "मूल्य", name: "नाम", phone: "फ़ोन", addToCart: "जोड़ें",
    outOfStock: "स्टॉक में नहीं", available: "उपलब्ध", transactionComplete: "लेन-देन पूर्ण",
    shortcuts: "शॉर्टकट", billing: "बिलिंग (F2)", customerSearch: "ग्राहक खोज (F4)",
  },
  mr: {
    dashboard: "डॅशबोर्ड", pos: "पीओएस बिलिंग", inventory: "इन्व्हेंटरी", udhaar: "उधारी वही",
    analytics: "अ‍ॅनालिटिक्स हब", settings: "सेटिंग्ज", todaysRevenue: "आजची विक्री",
    todaysProfit: "आजचा नफा", cashInUdhaar: "उधारीत अडकलेली रक्कम", projectedMonthly: "अंदाजित मासिक कमाई",
    searchPlaceholder: "नाव, ब्रँड शोधा किंवा बारकोड स्कॅन करा…", speak: "बोला", cart: "कार्ट",
    subtotal: "उप-बेरीज", gst: "जीएसटी", total: "एकूण", checkout: "पैसे भरा", cash: "रोख", upi: "यूपीआय",
    credit: "उधारी", empty: "कार्ट रिकामी आहे — शोधा किंवा स्कॅन करा", lowStock: "कमी साठा",
    expiringSoon: "लवकर संपणारे", fastMoving: "जलद विकले जाणारे", allItems: "सर्व वस्तू", category: "प्रकार",
    stock: "साठा", margin: "मार्जिन", reorder: "खरेदी ऑर्डर तयार करा", customers: "ग्राहक",
    addCustomer: "ग्राहक जोडा", trustLevel: "विश्वास पातळी", creditLimit: "उधारी मर्यादा", balance: "शिल्लक",
    sendReminder: "स्मरणपत्र पाठवा", recordPayment: "पैसे नोंदवा", overdue: "थकित", ok: "व्यवस्थित",
    watching: "लक्ष ठेवा", online: "ऑनलाइन", offline: "ऑफलाइन", darkMode: "डार्क मोड", language: "भाषा",
    hourlySales: "तासागणिक विक्री", categoryProfit: "प्रकारानुसार नफा",
    topMovers: "जलद वि. संथ विक्री", storeName: "दुकानाचे नाव", ownerName: "मालकाचे नाव",
    receipt: "पावती", print: "प्रिंट करा", whatsapp: "व्हॉट्सअ‍ॅपने पाठवा", close: "बंद करा",
    profit: "निव्वळ नफा", qty: "प्रमाण", price: "किंमत", name: "नाव", phone: "फोन", addToCart: "जोडा",
    outOfStock: "साठा नाही", available: "उपलब्ध", transactionComplete: "व्यवहार पूर्ण",
    shortcuts: "शॉर्टकट्स", billing: "बिलिंग (F2)", customerSearch: "ग्राहक शोध (F4)",
  },
};

/* ---------------------------- Product catalog ----------------------------- */
const CATEGORIES = ["Staples", "Dairy", "Spices & Oils", "Packaged Snacks", "Beverages", "Personal Care", "Cleaning & Household", "Bakery"];

const BASE_PRODUCTS = [
  // Staples
  { n: "Aashirvaad Whole Wheat Atta", l: "आशीर्वाद गेहूं आटा", b: "Aashirvaad", c: "Staples", price: 55, gst: 0, units: ["1kg", "5kg", "10kg"] },
  { n: "Fortune Basmati Rice", l: "फॉर्च्यून बासमती चावल", b: "Fortune", c: "Staples", price: 120, gst: 5, units: ["1kg", "5kg", "10kg"] },
  { n: "India Gate Basmati Rice", l: "इंडिया गेट बासमती चावल", b: "India Gate", c: "Staples", price: 135, gst: 5, units: ["1kg", "5kg"] },
  { n: "Tata Sampann Toor Dal", l: "टाटा संपन्न तूर दाल", b: "Tata Sampann", c: "Staples", price: 160, gst: 5, units: ["500g", "1kg", "2kg"] },
  { n: "Tata Sampann Chana Dal", l: "टाटा संपन्न चना दाल", b: "Tata Sampann", c: "Staples", price: 110, gst: 5, units: ["500g", "1kg"] },
  { n: "Tata Sampann Moong Dal", l: "टाटा संपन्न मूंग दाल", b: "Tata Sampann", c: "Staples", price: 150, gst: 5, units: ["500g", "1kg"] },
  { n: "Daawat Rozana Basmati Rice", l: "दावत रोज़ाना बासमती चावल", b: "Daawat", c: "Staples", price: 95, gst: 5, units: ["1kg", "5kg"] },
  { n: "Tata Salt", l: "टाटा नमक", b: "Tata", c: "Staples", price: 28, gst: 5, units: ["1kg"] },
  { n: "Pillsbury Chakki Atta", l: "पिल्सबरी चक्की आटा", b: "Pillsbury", c: "Staples", price: 58, gst: 0, units: ["1kg", "5kg"] },
  { n: "Patanjali Chana Besan", l: "पतंजलि चना बेसन", b: "Patanjali", c: "Staples", price: 68, gst: 5, units: ["500g", "1kg"] },
  { n: "Gemini Sugar", l: "जेमिनी चीनी", b: "Gemini", c: "Staples", price: 45, gst: 0, units: ["1kg", "5kg"] },
  { n: "Everest Poha", l: "एवरेस्ट पोहा", b: "Everest", c: "Staples", price: 40, gst: 5, units: ["500g", "1kg"] },
  { n: "MTR Rava / Sooji", l: "एमटीआर रवा / सूजी", b: "MTR", c: "Staples", price: 42, gst: 5, units: ["500g", "1kg"] },
  { n: "Catch Sabudana", l: "कैच साबूदाना", b: "Catch", c: "Staples", price: 65, gst: 5, units: ["500g", "1kg"] },
  { n: "24 Mantra Organic Rajma", l: "24 मंत्र ऑर्गेनिक राजमा", b: "24 Mantra", c: "Staples", price: 145, gst: 5, units: ["500g", "1kg"] },
  { n: "Tata Sampann Masoor Dal", l: "टाटा संपन्न मसूर दाल", b: "Tata Sampann", c: "Staples", price: 105, gst: 5, units: ["500g", "1kg"] },
  { n: "Kohinoor Basmati Rice", l: "कोहिनूर बासमती चावल", b: "Kohinoor", c: "Staples", price: 115, gst: 5, units: ["1kg", "5kg"] },
  { n: "Shakti Bhog Atta", l: "शक्ति भोग आटा", b: "Shakti Bhog", c: "Staples", price: 52, gst: 0, units: ["1kg", "5kg", "10kg"] },
  // Dairy
  { n: "Amul Gold Full Cream Milk", l: "अमूल गोल्ड फुल क्रीम दूध", b: "Amul", c: "Dairy", price: 33, gst: 0, units: ["500ml", "1L"] },
  { n: "Amul Taaza Toned Milk", l: "अमूल ताज़ा टोंड दूध", b: "Amul", c: "Dairy", price: 27, gst: 0, units: ["500ml", "1L"] },
  { n: "Amul Butter", l: "अमूल मक्खन", b: "Amul", c: "Dairy", price: 56, gst: 12, units: ["100g", "500g"] },
  { n: "Amul Fresh Paneer", l: "अमूल पनीर", b: "Amul", c: "Dairy", price: 90, gst: 5, units: ["200g", "500g"] },
  { n: "Amul Masti Dahi", l: "अमूल मस्ती दही", b: "Amul", c: "Dairy", price: 30, gst: 0, units: ["200g", "400g", "1kg"] },
  { n: "Mother Dairy Full Cream Milk", l: "मदर डेयरी फुल क्रीम दूध", b: "Mother Dairy", c: "Dairy", price: 32, gst: 0, units: ["500ml", "1L"] },
  { n: "Nestlé a+ Slim Milk", l: "नेस्ले a+ स्लिम दूध", b: "Nestlé", c: "Dairy", price: 34, gst: 0, units: ["500ml", "1L"] },
  { n: "Amul Cheese Slices", l: "अमूल चीज़ स्लाइस", b: "Amul", c: "Dairy", price: 120, gst: 12, units: ["100g", "200g"] },
  { n: "Britannia Cheese Cubes", l: "ब्रिटानिया चीज़ क्यूब्स", b: "Britannia", c: "Dairy", price: 95, gst: 12, units: ["200g"] },
  { n: "Amul Ghee", l: "अमूल घी", b: "Amul", c: "Dairy", price: 275, gst: 5, units: ["500ml", "1L"] },
  { n: "Nandini Curd", l: "नंदिनी दही", b: "Nandini", c: "Dairy", price: 28, gst: 0, units: ["200g", "500g"] },
  { n: "Go Cheese Mozzarella", l: "गो चीज़ मोज़रेला", b: "Go Cheese", c: "Dairy", price: 210, gst: 12, units: ["200g", "400g"] },
  { n: "Amul Ice Cream Tub", l: "अमूल आइसक्रीम टब", b: "Amul", c: "Dairy", price: 150, gst: 18, units: ["500ml", "1L"] },
  { n: "Britannia Winkin' Cow Milkshake", l: "ब्रिटानिया विंकिन काऊ मिल्कशेक", b: "Britannia", c: "Dairy", price: 25, gst: 12, units: ["180ml"] },
  { n: "Epigamia Greek Yogurt", l: "एपिगामिया ग्रीक योगर्ट", b: "Epigamia", c: "Dairy", price: 45, gst: 5, units: ["90g", "400g"] },
  // Spices & Oils
  { n: "Fortune Sunlite Refined Oil", l: "फॉर्च्यून सनलाइट तेल", b: "Fortune", c: "Spices & Oils", price: 140, gst: 5, units: ["1L", "5L", "15L"] },
  { n: "Saffola Gold Oil", l: "सफोला गोल्ड तेल", b: "Saffola", c: "Spices & Oils", price: 165, gst: 5, units: ["1L", "5L"] },
  { n: "Dhara Mustard Oil", l: "धारा सरसों तेल", b: "Dhara", c: "Spices & Oils", price: 155, gst: 5, units: ["1L", "5L"] },
  { n: "Patanjali Kachi Ghani Mustard Oil", l: "पतंजलि कच्ची घानी सरसों तेल", b: "Patanjali", c: "Spices & Oils", price: 150, gst: 5, units: ["1L", "5L"] },
  { n: "MDH Deggi Mirch", l: "एमडीएच देगी मिर्च", b: "MDH", c: "Spices & Oils", price: 55, gst: 5, units: ["100g", "200g"] },
  { n: "MDH Garam Masala", l: "एमडीएच गरम मसाला", b: "MDH", c: "Spices & Oils", price: 60, gst: 5, units: ["100g", "200g"] },
  { n: "Everest Kitchen King Masala", l: "एवरेस्ट किचन किंग मसाला", b: "Everest", c: "Spices & Oils", price: 58, gst: 5, units: ["100g", "200g"] },
  { n: "Everest Turmeric Powder", l: "एवरेस्ट हल्दी पाउडर", b: "Everest", c: "Spices & Oils", price: 48, gst: 5, units: ["200g", "500g"] },
  { n: "Catch Black Pepper", l: "कैच काली मिर्च", b: "Catch", c: "Spices & Oils", price: 95, gst: 5, units: ["100g"] },
  { n: "Aachi Coriander Powder", l: "आची धनिया पाउडर", b: "Aachi", c: "Spices & Oils", price: 40, gst: 5, units: ["200g", "500g"] },
  { n: "Badshah Chole Masala", l: "बादशाह छोले मसाला", b: "Badshah", c: "Spices & Oils", price: 52, gst: 5, units: ["100g"] },
  { n: "Gits Chana Masala", l: "गिट्स चना मसाला", b: "Gits", c: "Spices & Oils", price: 45, gst: 5, units: ["100g"] },
  { n: "Ashoka Cumin Seeds (Jeera)", l: "अशोका जीरा", b: "Ashoka", c: "Spices & Oils", price: 78, gst: 5, units: ["100g", "200g"] },
  { n: "Ashoka Mustard Seeds", l: "अशोका राई", b: "Ashoka", c: "Spices & Oils", price: 32, gst: 5, units: ["100g"] },
  { n: "Idhayam Gingelly Oil", l: "इधायम गिंगेली तेल", b: "Idhayam", c: "Spices & Oils", price: 210, gst: 5, units: ["500ml", "1L"] },
  { n: "Emami Healthy & Tasty Oil", l: "इमामी हेल्दी एंड टेस्टी तेल", b: "Emami", c: "Spices & Oils", price: 148, gst: 5, units: ["1L", "5L"] },
  { n: "MDH Sabzi Masala", l: "एमडीएच सब्ज़ी मसाला", b: "MDH", c: "Spices & Oils", price: 48, gst: 5, units: ["100g"] },
  { n: "Everest Sambhar Masala", l: "एवरेस्ट सांभर मसाला", b: "Everest", c: "Spices & Oils", price: 46, gst: 5, units: ["100g", "200g"] },
  // Packaged Snacks
  { n: "Haldiram's Aloo Bhujia", l: "हल्दीराम आलू भुजिया", b: "Haldiram's", c: "Packaged Snacks", price: 45, gst: 12, units: ["150g", "400g"] },
  { n: "Haldiram's Moong Dal", l: "हल्दीराम मूंग दाल", b: "Haldiram's", c: "Packaged Snacks", price: 42, gst: 12, units: ["150g", "400g"] },
  { n: "Lay's Classic Salted", l: "लेज़ क्लासिक सॉल्टेड", b: "Lay's", c: "Packaged Snacks", price: 20, gst: 12, units: ["52g", "90g"] },
  { n: "Kurkure Masala Munch", l: "कुरकुरे मसाला मंच", b: "Kurkure", c: "Packaged Snacks", price: 20, gst: 12, units: ["55g", "90g"] },
  { n: "Parle-G Biscuits", l: "पार्ले-जी बिस्कुट", b: "Parle", c: "Packaged Snacks", price: 10, gst: 18, units: ["70g", "200g", "800g"] },
  { n: "Britannia Good Day Cookies", l: "ब्रिटानिया गुड डे कुकीज़", b: "Britannia", c: "Packaged Snacks", price: 30, gst: 18, units: ["100g", "216g"] },
  { n: "Bikaji Bhujia Sev", l: "बीकाजी भुजिया सेव", b: "Bikaji", c: "Packaged Snacks", price: 50, gst: 12, units: ["200g", "400g"] },
  { n: "Bingo Mad Angles", l: "बिंगो मैड एंगल्स", b: "Bingo", c: "Packaged Snacks", price: 20, gst: 12, units: ["66g"] },
  { n: "Maggi 2-Minute Noodles", l: "मैगी 2-मिनट नूडल्स", b: "Maggi", c: "Packaged Snacks", price: 14, gst: 18, units: ["70g", "280g (4-pack)"] },
  { n: "Top Ramen Noodles", l: "टॉप रामेन नूडल्स", b: "Top Ramen", c: "Packaged Snacks", price: 15, gst: 18, units: ["70g"] },
  { n: "Act II Popcorn", l: "एक्ट II पॉपकॉर्न", b: "Act II", c: "Packaged Snacks", price: 30, gst: 12, units: ["40g", "70g"] },
  { n: "Cadbury Dairy Milk", l: "कैडबरी डेयरी मिल्क", b: "Cadbury", c: "Packaged Snacks", price: 40, gst: 18, units: ["24g", "55g"] },
  { n: "Amul Chocolate", l: "अमूल चॉकलेट", b: "Amul", c: "Packaged Snacks", price: 20, gst: 18, units: ["25g"] },
  { n: "Haldiram's Soan Papdi", l: "हल्दीराम सोन पापड़ी", b: "Haldiram's", c: "Packaged Snacks", price: 60, gst: 12, units: ["250g", "500g"] },
  { n: "Uncle Chipps", l: "अंकल चिप्स", b: "Uncle Chipps", c: "Packaged Snacks", price: 20, gst: 12, units: ["55g"] },
  { n: "Haldiram's Namkeen Mix", l: "हल्दीराम नमकीन मिक्स", b: "Haldiram's", c: "Packaged Snacks", price: 48, gst: 12, units: ["200g", "400g"] },
  { n: "Too Yumm Multigrain Chips", l: "टू यम मल्टीग्रेन चिप्स", b: "Too Yumm", c: "Packaged Snacks", price: 30, gst: 12, units: ["60g"] },
  { n: "Sunfeast Yippee Noodles", l: "सनफीस्ट यिप्पी नूडल्स", b: "Sunfeast", c: "Packaged Snacks", price: 15, gst: 18, units: ["70g", "280g (4-pack)"] },
  // Beverages
  { n: "Tata Tea Gold", l: "टाटा टी गोल्ड", b: "Tata Tea", c: "Beverages", price: 140, gst: 5, units: ["250g", "500g", "1kg"] },
  { n: "Red Label Tea", l: "रेड लेबल चाय", b: "Brooke Bond", c: "Beverages", price: 130, gst: 5, units: ["250g", "500g"] },
  { n: "Nescafé Classic Coffee", l: "नेस्कैफे क्लासिक कॉफ़ी", b: "Nescafé", c: "Beverages", price: 130, gst: 12, units: ["50g", "100g"] },
  { n: "Bru Instant Coffee", l: "ब्रू इंस्टेंट कॉफ़ी", b: "Bru", c: "Beverages", price: 120, gst: 12, units: ["50g", "100g"] },
  { n: "Coca-Cola", l: "कोका-कोला", b: "Coca-Cola", c: "Beverages", price: 40, gst: 28, units: ["600ml", "750ml"] },
  { n: "Pepsi", l: "पेप्सी", b: "Pepsi", c: "Beverages", price: 40, gst: 28, units: ["600ml", "750ml"] },
  { n: "Sprite", l: "स्प्राइट", b: "Sprite", c: "Beverages", price: 40, gst: 28, units: ["600ml", "750ml"] },
  { n: "Frooti Mango Drink", l: "फ्रूटी मैंगो ड्रिंक", b: "Frooti", c: "Beverages", price: 20, gst: 12, units: ["160ml", "250ml"] },
  { n: "Real Fruit Juice", l: "रियल फ्रूट जूस", b: "Real", c: "Beverages", price: 110, gst: 12, units: ["1L"] },
  { n: "Bisleri Mineral Water", l: "बिसलेरी पानी", b: "Bisleri", c: "Beverages", price: 20, gst: 18, units: ["1L", "2L"] },
  { n: "Horlicks Health Drink", l: "हॉर्लिक्स हेल्थ ड्रिंक", b: "Horlicks", c: "Beverages", price: 230, gst: 18, units: ["500g", "1kg"] },
  { n: "Bournvita Health Drink", l: "बोर्नविटा हेल्थ ड्रिंक", b: "Bournvita", c: "Beverages", price: 220, gst: 18, units: ["500g", "1kg"] },
  { n: "Rasna Instant Drink Mix", l: "रसना इंस्टेंट ड्रिंक मिक्स", b: "Rasna", c: "Beverages", price: 55, gst: 12, units: ["500g"] },
  { n: "Paper Boat Aamras", l: "पेपर बोट आमरस", b: "Paper Boat", c: "Beverages", price: 30, gst: 12, units: ["200ml"] },
  // Personal Care
  { n: "Colgate Strong Teeth Toothpaste", l: "कोलगेट स्ट्रॉन्ग टीथ टूथपेस्ट", b: "Colgate", c: "Personal Care", price: 55, gst: 18, units: ["100g", "200g"] },
  { n: "Dabur Red Toothpaste", l: "डाबर लाल टूथपेस्ट", b: "Dabur", c: "Personal Care", price: 50, gst: 18, units: ["100g", "200g"] },
  { n: "Lifebuoy Total Soap", l: "लाइफबॉय टोटल साबुन", b: "Lifebuoy", c: "Personal Care", price: 32, gst: 18, units: ["100g (1pc)", "300g (3pc)"] },
  { n: "Dove Beauty Bar", l: "डव ब्यूटी बार", b: "Dove", c: "Personal Care", price: 55, gst: 18, units: ["100g (1pc)", "300g (3pc)"] },
  { n: "Head & Shoulders Shampoo", l: "हेड एंड शोल्डर्स शैम्पू", b: "Head & Shoulders", c: "Personal Care", price: 95, gst: 18, units: ["180ml", "340ml"] },
  { n: "Clinic Plus Shampoo", l: "क्लिनिक प्लस शैम्पू", b: "Clinic Plus", c: "Personal Care", price: 65, gst: 18, units: ["175ml", "355ml"] },
  { n: "Parachute Coconut Oil", l: "परांचुते नारियल तेल", b: "Parachute", c: "Personal Care", price: 90, gst: 18, units: ["200ml", "500ml"] },
  { n: "Nivea Body Lotion", l: "निविया बॉडी लोशन", b: "Nivea", c: "Personal Care", price: 150, gst: 18, units: ["200ml", "400ml"] },
  { n: "Gillette Guard Razor", l: "जिलेट गार्ड रेज़र", b: "Gillette", c: "Personal Care", price: 40, gst: 18, units: ["1pc"] },
  { n: "Whisper Ultra Sanitary Pads", l: "व्हिस्पर अल्ट्रा पैड्स", b: "Whisper", c: "Personal Care", price: 95, gst: 12, units: ["7pc", "15pc"] },
  { n: "Johnson's Baby Powder", l: "जॉनसन बेबी पाउडर", b: "Johnson's", c: "Personal Care", price: 110, gst: 18, units: ["100g", "200g"] },
  { n: "Vaseline Petroleum Jelly", l: "वैसलीन पेट्रोलियम जेली", b: "Vaseline", c: "Personal Care", price: 65, gst: 18, units: ["100ml", "200ml"] },
  { n: "Patanjali Aloe Vera Gel", l: "पतंजलि एलोवेरा जेल", b: "Patanjali", c: "Personal Care", price: 85, gst: 18, units: ["150ml"] },
  { n: "Fair & Lovely / Glow & Lovely", l: "ग्लो एंड लवली", b: "Glow & Lovely", c: "Personal Care", price: 80, gst: 18, units: ["25g", "50g"] },
  { n: "Old Spice Deodorant", l: "ओल्ड स्पाइस डिओडोरेंट", b: "Old Spice", c: "Personal Care", price: 190, gst: 18, units: ["150ml"] },
  { n: "Patanjali Dant Kanti Toothpaste", l: "पतंजलि दंत कांति टूथपेस्ट", b: "Patanjali", c: "Personal Care", price: 55, gst: 18, units: ["100g", "200g"] },
  { n: "Himalaya Neem Face Wash", l: "हिमालया नीम फेस वॉश", b: "Himalaya", c: "Personal Care", price: 85, gst: 18, units: ["100ml", "200ml"] },
  // Cleaning & Household
  { n: "Surf Excel Easy Wash", l: "सर्फ एक्सेल ईज़ी वॉश", b: "Surf Excel", c: "Cleaning & Household", price: 65, gst: 18, units: ["500g", "1kg", "4kg"] },
  { n: "Ariel Matic Detergent", l: "एरियल मैटिक डिटर्जेंट", b: "Ariel", c: "Cleaning & Household", price: 130, gst: 18, units: ["1kg", "2kg"] },
  { n: "Nirma Washing Powder", l: "निरमा वाशिंग पाउडर", b: "Nirma", c: "Cleaning & Household", price: 45, gst: 18, units: ["1kg", "4kg"] },
  { n: "Vim Dishwash Bar", l: "विम डिशवॉश बार", b: "Vim", c: "Cleaning & Household", price: 20, gst: 18, units: ["1pc", "3pc"] },
  { n: "Vim Dishwash Liquid Gel", l: "विम डिशवॉश जेल", b: "Vim", c: "Cleaning & Household", price: 95, gst: 18, units: ["500ml"] },
  { n: "Harpic Toilet Cleaner", l: "हार्पिक टॉयलेट क्लीनर", b: "Harpic", c: "Cleaning & Household", price: 85, gst: 18, units: ["500ml", "1L"] },
  { n: "Lizol Disinfectant Floor Cleaner", l: "लिज़ोल फ्लोर क्लीनर", b: "Lizol", c: "Cleaning & Household", price: 190, gst: 18, units: ["500ml", "975ml"] },
  { n: "Colin Glass Cleaner", l: "कॉलिन ग्लास क्लीनर", b: "Colin", c: "Cleaning & Household", price: 75, gst: 18, units: ["500ml"] },
  { n: "Odonil Air Freshener", l: "ओडोनिल एयर फ्रेशनर", b: "Odonil", c: "Cleaning & Household", price: 65, gst: 18, units: ["75g"] },
  { n: "Good Knight Mosquito Repellent", l: "गुड नाइट मच्छर भगाने वाला", b: "Good Knight", c: "Cleaning & Household", price: 55, gst: 18, units: ["45ml refill"] },
  { n: "Scotch-Brite Scrub Pad", l: "स्कॉच-ब्राइट स्क्रब पैड", b: "Scotch-Brite", c: "Cleaning & Household", price: 25, gst: 18, units: ["1pc", "2pc"] },
  { n: "Exo Dishwash Bar", l: "एक्सो डिशवॉश बार", b: "Exo", c: "Cleaning & Household", price: 18, gst: 18, units: ["1pc", "3pc"] },
  { n: "Domex Toilet Cleaner", l: "डोमेक्स टॉयलेट क्लीनर", b: "Domex", c: "Cleaning & Household", price: 78, gst: 18, units: ["500ml", "1L"] },
  { n: "All Out Mosquito Repellent", l: "ऑल आउट मच्छर भगाने वाला", b: "All Out", c: "Cleaning & Household", price: 58, gst: 18, units: ["45ml refill"] },
  // Bakery
  { n: "Britannia Bread", l: "ब्रिटानिया ब्रेड", b: "Britannia", c: "Bakery", price: 45, gst: 0, units: ["400g"] },
  { n: "Modern Bread", l: "मॉडर्न ब्रेड", b: "Modern", c: "Bakery", price: 40, gst: 0, units: ["400g"] },
  { n: "Britannia Bourbon Biscuits", l: "ब्रिटानिया बॉर्बन बिस्कुट", b: "Britannia", c: "Bakery", price: 35, gst: 18, units: ["100g", "150g"] },
  { n: "Britannia Marie Gold", l: "ब्रिटानिया मैरी गोल्ड", b: "Britannia", c: "Bakery", price: 25, gst: 18, units: ["150g", "250g"] },
  { n: "Sunfeast Dark Fantasy", l: "सनफीस्ट डार्क फैंटेसी", b: "Sunfeast", c: "Bakery", price: 45, gst: 18, units: ["100g", "300g"] },
  { n: "Britannia Rusk", l: "ब्रिटानिया रस्क", b: "Britannia", c: "Bakery", price: 40, gst: 18, units: ["200g", "300g"] },
  { n: "Monginis Cup Cake", l: "मॉन्जिनीस कप केक", b: "Monginis", c: "Bakery", price: 30, gst: 18, units: ["1pc"] },
  { n: "Britannia Cream Cracker", l: "ब्रिटानिया क्रीम क्रैकर", b: "Britannia", c: "Bakery", price: 30, gst: 18, units: ["200g"] },
  { n: "Britannia NutriChoice Digestive", l: "ब्रिटानिया न्यूट्रीचॉइस डाइजेस्टिव", b: "Britannia", c: "Bakery", price: 45, gst: 18, units: ["100g", "200g"] },
  { n: "Karachi Bakery Fruit Biscuits", l: "कराची बेकरी फ्रूट बिस्कुट", b: "Karachi Bakery", c: "Bakery", price: 90, gst: 18, units: ["400g"] },
];

function pad(num, len) { return String(num).padStart(len, "0"); }
function genBarcode(i) { return "890" + pad(Math.floor(rng() * 1e9), 9).slice(0, 9); }

function buildCatalog() {
  const products = [];
  let counter = 1;
  BASE_PRODUCTS.forEach((bp) => {
    bp.units.forEach((unitLabel, uIdx) => {
      // scale cost roughly with pack size text
      const sizeMultiplier = 1 + uIdx * (0.85 + rng() * 0.6) * 3.2;
      const sellingPrice = Math.round(bp.price * (uIdx === 0 ? 1 : sizeMultiplier));
      const costPrice = Math.round(sellingPrice * (0.72 + rng() * 0.13));
      const marginAmt = sellingPrice - costPrice;
      const marginPct = Math.round((marginAmt / sellingPrice) * 1000) / 10;
      const stock = randInt(0, 140);
      const reorderThreshold = randInt(8, 25);
      const expiryDays = randInt(-5, 220);
      const expiry = new Date(Date.now() + expiryDays * 86400000).toISOString().slice(0, 10);
      const velocity = Math.round(20 + rng() * 80 - (uIdx * 6));
      products.push({
        id: `p${counter}`,
        barcode_sku: genBarcode(counter),
        product_name: `${bp.n}`,
        local_name: bp.l,
        brand_name: bp.b,
        category: bp.c,
        net_quantity: unitLabel,
        cost_price: costPrice,
        selling_price: sellingPrice,
        gst_rate: bp.gst,
        profit_margin_amount: marginAmt,
        profit_margin_percent: marginPct,
        available_stock: stock,
        reorder_threshold: reorderThreshold,
        expiry_date: expiry,
        sales_velocity_score: Math.max(1, Math.min(100, velocity)),
      });
      counter++;
    });
  });
  return products;
}

const CUSTOMER_NAMES = [
  "Ramesh Patil", "Sunita Devi", "Anil Kumar", "Priya Sharma", "Manoj Yadav",
  "Kavita Joshi", "Suresh Nair", "Deepa Iyer", "Rajesh Gupta", "Meena Rao",
  "Vikas Singh", "Pooja Mehta", "Arun Reddy", "Neha Kulkarni", "Sanjay Verma",
];

function buildCustomers() {
  return CUSTOMER_NAMES.map((name, i) => {
    const balance = randInt(0, 4200);
    const daysAgo = randInt(0, 45);
    const lastTxnDate = new Date(Date.now() - daysAgo * 86400000).toISOString().slice(0, 10);
    return {
      id: `c${i + 1}`,
      name,
      phone: `9${randInt(100000000, 999999999)}`,
      address: `${randInt(1, 200)}, ${pick(["Gandhi Nagar", "Shivaji Chowk", "MG Road", "Station Road", "Ambedkar Colony"])}`,
      trust: randInt(2, 5),
      balance,
      creditLimit: pick([2000, 3000, 5000, 8000]),
      lastTxnDate,
    };
  });
}

/* ---------------------------- Helpers -------------------------------------- */
const inr = (n) => "₹" + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
function ageBucket(days) {
  if (days <= 7) return { label: "fresh", color: "#22C55E" };
  if (days <= 30) return { label: "watch", color: "#F59E0B" };
  return { label: "overdue", color: "#EF4444" };
}
function daysUntil(dateStr) {
  return Math.round((new Date(dateStr).getTime() - Date.now()) / 86400000);
}
function daysSince(dateStr) {
  return Math.round((Date.now() - new Date(dateStr).getTime()) / 86400000);
}
function todayISO() { return new Date().toISOString().slice(0, 10); }

/* ---------------------------- Small UI atoms -------------------------------- */
function StatCard({ icon: Icon, label, value, sub, tone = "green", dark }) {
  const toneMap = {
    green: { bg: dark ? "bg-green-500/10" : "bg-green-50", ic: "text-green-600", ring: "ring-green-500/20" },
    indigo: { bg: dark ? "bg-[#0F2A52]/10" : "bg-[#EAF0F8]", ic: "text-[#0F2A52]", ring: "ring-[#0F2A52]/20" },
    amber: { bg: dark ? "bg-amber-500/10" : "bg-amber-50", ic: "text-amber-600", ring: "ring-amber-500/20" },
    red: { bg: dark ? "bg-red-500/10" : "bg-red-50", ic: "text-red-600", ring: "ring-red-500/20" },
  }[tone];
  return (
    <div className={`rounded-2xl p-4 sm:p-5 backdrop-blur-md ${dark ? "bg-slate-900/70 ring-1 ring-white/10" : "bg-white ring-1 ring-slate-900/5"} shadow-sm`}>
      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${toneMap.bg} ${toneMap.ic}`}>
          <Icon size={20} />
        </span>
      </div>
      <p className={`mt-3 text-xs font-medium ${dark ? "text-slate-400" : "text-slate-500"}`}>{label}</p>
      <p className={`text-2xl font-bold tabular-nums ${dark ? "text-white" : "text-slate-900"}`}>{value}</p>
      {sub && <p className={`text-xs mt-1 ${dark ? "text-slate-500" : "text-slate-400"}`}>{sub}</p>}
    </div>
  );
}

function Pill({ children, tone = "slate", dark }) {
  const map = {
    slate: dark ? "bg-slate-700/60 text-slate-200" : "bg-slate-100 text-slate-600",
    green: dark ? "bg-green-500/15 text-green-400" : "bg-green-50 text-green-700",
    amber: dark ? "bg-amber-500/15 text-amber-400" : "bg-amber-50 text-amber-700",
    red: dark ? "bg-red-500/15 text-red-400" : "bg-red-50 text-red-700",
    indigo: dark ? "bg-[#0F2A52]/15 text-[#5B84B8]" : "bg-[#EAF0F8] text-[#0F2A52]",
  };
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${map[tone]}`}>{children}</span>;
}

/* Simple pseudo-QR visual (demo only, not a scannable code) */
function PseudoQR({ seedText, size = 132 }) {
  const cells = 14;
  const rand = useMemo(() => {
    let h = 0;
    for (let i = 0; i < seedText.length; i++) h = (h * 31 + seedText.charCodeAt(i)) >>> 0;
    return mulberry32(h);
  }, [seedText]);
  const grid = useMemo(() => Array.from({ length: cells * cells }, () => rand() > 0.55), [rand]);
  const cell = size / cells;
  return (
    <svg width={size} height={size} className="rounded-lg bg-white p-1 shadow-inner">
      {grid.map((on, i) => {
        if (!on) return null;
        const x = (i % cells) * cell, y = Math.floor(i / cells) * cell;
        return <rect key={i} x={x} y={y} width={cell} height={cell} fill="#0F2A52" />;
      })}
      {/* finder corners */}
      {[[0, 0], [size - cell * 3, 0], [0, size - cell * 3]].map(([x, y], idx) => (
        <g key={idx}>
          <rect x={x} y={y} width={cell * 3} height={cell * 3} fill="#0F2A52" />
          <rect x={x + cell} y={y + cell} width={cell} height={cell} fill="white" />
        </g>
      ))}
    </svg>
  );
}

/* ============================================================================
   MAIN APP
   ========================================================================== */
export default function App() {
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState("en");
  const t = DICT[lang];

  const [products, setProducts] = useState(() => buildCatalog());
  const [customers, setCustomers] = useState(() => buildCustomers());
  const [transactions, setTransactions] = useState([]); // {id, time, items, subtotal, gst, total, profit, mode, hour}
  const [cart, setCart] = useState([]); // {productId, qty}
  const [activeTab, setActiveTab] = useState("dashboard");
  const [online, setOnline] = useState(true);
  const [queuedTxns, setQueuedTxns] = useState(0);

  const [search, setSearch] = useState("");
  const [listening, setListening] = useState(false);
  const recogRef = useRef(null);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [payMode, setPayMode] = useState("cash");
  const [showReceipt, setShowReceipt] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [toast, setToast] = useState(null);

  const [invCategory, setInvCategory] = useState("All");
  const [invFilter, setInvFilter] = useState("all");
  const [invSort, setInvSort] = useState("name");

  useEffect(() => {
    if (!toast) return;
    const tm = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(tm);
  }, [toast]);

  /* ------------------- Keyboard shortcuts (F2 / F4) ------------------- */
  useEffect(() => {
    function onKey(e) {
      if (e.key === "F2") { e.preventDefault(); setActiveTab("pos"); }
      if (e.key === "F4") { e.preventDefault(); setActiveTab("udhaar"); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ------------------- Voice search (Web Speech API) ------------------- */
  const startVoice = useCallback(() => {
    const SR = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SR) { setToast({ tone: "amber", msg: "Voice search isn't supported in this browser." }); return; }
    const recog = new SR();
    recog.lang = lang === "hi" ? "hi-IN" : lang === "mr" ? "mr-IN" : "en-IN";
    recog.interimResults = false;
    recog.maxAlternatives = 1;
    recog.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setSearch(text);
    };
    recog.onend = () => setListening(false);
    recog.onerror = () => setListening(false);
    recogRef.current = recog;
    setListening(true);
    recog.start();
  }, [lang]);

  /* ------------------- Derived: filtered products for POS ------------------- */
  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products.slice(0, 24);
    return products.filter((p) =>
      p.product_name.toLowerCase().includes(q) ||
      p.local_name.includes(search.trim()) ||
      p.brand_name.toLowerCase().includes(q) ||
      p.barcode_sku.includes(q)
    ).slice(0, 40);
  }, [search, products]);

  /* ------------------- Cart math ------------------- */
  const cartLines = useMemo(() => cart.map((line) => {
    const p = products.find((x) => x.id === line.productId);
    return p ? { ...line, product: p } : null;
  }).filter(Boolean), [cart, products]);

  const cartSubtotal = cartLines.reduce((s, l) => s + l.product.selling_price * l.qty, 0);
  const cartGst = cartLines.reduce((s, l) => s + (l.product.selling_price * l.qty * l.product.gst_rate) / 100, 0);
  const cartProfit = cartLines.reduce((s, l) => s + l.product.profit_margin_amount * l.qty, 0);
  const cartTotal = cartSubtotal + cartGst;

  function addToCart(productId) {
    const p = products.find((x) => x.id === productId);
    if (!p || p.available_stock <= 0) { setToast({ tone: "red", msg: t.outOfStock }); return; }
    setCart((prev) => {
      const existing = prev.find((l) => l.productId === productId);
      if (existing) return prev.map((l) => l.productId === productId ? { ...l, qty: Math.min(l.qty + 1, p.available_stock) } : l);
      return [...prev, { productId, qty: 1 }];
    });
  }
  function changeQty(productId, delta) {
    setCart((prev) => prev.map((l) => {
      if (l.productId !== productId) return l;
      const p = products.find((x) => x.id === productId);
      const nextQty = Math.max(1, Math.min(l.qty + delta, p ? p.available_stock : 99));
      return { ...l, qty: nextQty };
    }));
  }
  function setQty(productId, value) {
    setCart((prev) => prev.map((l) => {
      if (l.productId !== productId) return l;
      const p = products.find((x) => x.id === productId);
      const nextQty = Math.max(1, Math.min(Math.round(Number(value) || 1), p ? p.available_stock : 99));
      return { ...l, qty: nextQty };
    }));
  }
  function removeFromCart(productId) { setCart((prev) => prev.filter((l) => l.productId !== productId)); }

  function completeCheckout() {
    if (cartLines.length === 0) return;
    if (payMode === "credit" && !selectedCustomer) { setToast({ tone: "amber", msg: "Select a customer for Udhaar." }); return; }

    setProducts((prev) => prev.map((p) => {
      const line = cartLines.find((l) => l.product.id === p.id);
      return line ? { ...p, available_stock: Math.max(0, p.available_stock - line.qty) } : p;
    }));

    const now = new Date();
    const txn = {
      id: `txn${transactions.length + 1}`,
      time: now.toISOString(),
      hour: now.getHours(),
      items: cartLines.map((l) => ({ name: l.product.product_name, qty: l.qty, price: l.product.selling_price })),
      subtotal: cartSubtotal, gst: cartGst, total: cartTotal, profit: cartProfit,
      mode: payMode, customer: payMode === "credit" ? selectedCustomer : null,
    };
    setTransactions((prev) => [...prev, txn]);

    if (payMode === "credit" && selectedCustomer) {
      setCustomers((prev) => prev.map((c) => c.id === selectedCustomer.id ? { ...c, balance: c.balance + cartTotal, lastTxnDate: todayISO() } : c));
    }
    if (!online) setQueuedTxns((q) => q + 1);

    setShowReceipt(txn);
    setCart([]);
    setSelectedCustomer(null);
    setPayMode("cash");
    setToast({ tone: "green", msg: t.transactionComplete });
  }

  function recordPayment(customerId, amount) {
    setCustomers((prev) => prev.map((c) => c.id === customerId ? { ...c, balance: Math.max(0, c.balance - amount) } : c));
    setToast({ tone: "green", msg: `Payment of ${inr(amount)} recorded.` });
  }

  function setCustomerBalance(id, value) {
    const balance = Math.max(0, Number(value) || 0);
    setCustomers((prev) => prev.map((c) => c.id === id ? { ...c, balance } : c));
  }
  function setCustomerCreditLimit(id, value) {
    const limit = Math.max(0, Math.round(Number(value) || 0));
    setCustomers((prev) => prev.map((c) => c.id === id ? { ...c, creditLimit: limit } : c));
  }
  function setCustomerLastTxnDate(id, dateStr) {
    setCustomers((prev) => prev.map((c) => c.id === id ? { ...c, lastTxnDate: dateStr } : c));
  }
  function setCustomerTrust(id, trust) {
    setCustomers((prev) => prev.map((c) => c.id === id ? { ...c, trust } : c));
  }

  function whatsappReminderLink(c) {
    const msg = `Namaste ${c.name} ji, aapka outstanding Udhaar balance ${inr(c.balance)} hai. Kripya jald bhugtan karein. Dhanyavaad — RetailCore Store`;
    return `https://wa.me/91${c.phone}?text=${encodeURIComponent(msg)}`;
  }
  function whatsappReceiptLink(txn) {
    const lines = txn.items.map((i) => `${i.name} x${i.qty} = ${inr(i.price * i.qty)}`).join("%0A");
    const msg = `RetailCore Receipt%0A${lines}%0ATotal: ${inr(txn.total)}%0AThank you for shopping with us!`;
    return `https://wa.me/?text=${msg}`;
  }

  /* ------------------- Analytics derivations ------------------- */
  const today = new Date().toDateString();
  const todaysTxns = transactions; // demo: treat all session txns as "today"
  const todaysRevenue = todaysTxns.reduce((s, x) => s + x.total, 0);
  const todaysProfit = todaysTxns.reduce((s, x) => s + x.profit, 0);
  const totalUdhaar = customers.reduce((s, c) => s + c.balance, 0);
  const avgVelocity = products.reduce((s, p) => s + p.sales_velocity_score, 0) / products.length;
  const projectedMonthly = Math.round((todaysProfit || avgVelocity * 9) * 30);

  const hourlyData = useMemo(() => {
    const base = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21].map((h) => ({
      hour: `${h}:00`, sales: Math.round(300 + Math.sin((h - 8) / 13 * Math.PI) * 900 + rng() * 150),
    }));
    todaysTxns.forEach((tx) => {
      const idx = base.findIndex((b) => parseInt(b.hour) === tx.hour);
      if (idx >= 0) base[idx].sales += tx.total;
    });
    return base;
  }, [todaysTxns]);

  const categoryProfitData = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      map[p.category] = (map[p.category] || 0) + p.profit_margin_amount * (100 - p.available_stock < 0 ? 0 : 1);
    });
    return CATEGORIES.map((c) => ({ name: c, value: Math.round(map[c] || 0) }));
  }, [products]);
  const PIE_COLORS = ["#0F2A52", "#16A34A", "#DC2626", "#1B3B6F", "#22C55E", "#EF4444", "#5B84B8", "#86EFAC"];

  const topMoversData = useMemo(() => {
    const sorted = [...products].sort((a, b) => b.sales_velocity_score - a.sales_velocity_score);
    const fast = sorted.slice(0, 6).map((p) => ({ name: p.product_name.slice(0, 14), score: p.sales_velocity_score, type: "Fast" }));
    const dead = sorted.slice(-6).map((p) => ({ name: p.product_name.slice(0, 14), score: p.sales_velocity_score, type: "Dead" }));
    return [...fast, ...dead];
  }, [products]);

  const lowStockItems = products.filter((p) => p.available_stock < p.reorder_threshold);
  const expiringItems = products.filter((p) => { const d = daysUntil(p.expiry_date); return d >= 0 && d <= 30; });

  /* ------------------- Inventory filters ------------------- */
  const inventoryView = useMemo(() => {
    let list = products;
    if (invCategory !== "All") list = list.filter((p) => p.category === invCategory);
    if (invFilter === "low") list = list.filter((p) => p.available_stock < p.reorder_threshold);
    if (invFilter === "expiring") list = list.filter((p) => { const d = daysUntil(p.expiry_date); return d >= 0 && d <= 30; });
    if (invFilter === "fast") list = list.filter((p) => p.sales_velocity_score >= 70);
    if (invSort === "margin") list = [...list].sort((a, b) => b.profit_margin_percent - a.profit_margin_percent);
    if (invSort === "stock") list = [...list].sort((a, b) => a.available_stock - b.available_stock);
    if (invSort === "name") list = [...list].sort((a, b) => a.product_name.localeCompare(b.product_name));
    return list.slice(0, 80);
  }, [products, invCategory, invFilter, invSort]);

  function adjustStock(id, delta) {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, available_stock: Math.max(0, p.available_stock + delta) } : p));
  }

  function setStock(id, value) {
    const stock = Math.max(0, Math.round(Number(value) || 0));
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, available_stock: stock } : p));
  }

  function setExpiry(id, dateStr) {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, expiry_date: dateStr } : p));
  }

  function setReorderThreshold(id, value) {
    const th = Math.max(0, Math.round(Number(value) || 0));
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, reorder_threshold: th } : p));
  }

  function setSellingPrice(id, value) {
    const selling = Math.max(0, Number(value) || 0);
    setProducts((prev) => prev.map((p) => {
      if (p.id !== id) return p;
      const profit = selling - p.cost_price;
      const marginPct = selling > 0 ? Math.round((profit / selling) * 1000) / 10 : 0;
      return { ...p, selling_price: selling, profit_margin_amount: profit, profit_margin_percent: marginPct };
    }));
  }

  function setProfitPerPack(id, value) {
    const profit = Number(value) || 0;
    setProducts((prev) => prev.map((p) => {
      if (p.id !== id) return p;
      const cost = Math.max(0, p.selling_price - profit);
      const marginPct = p.selling_price > 0 ? Math.round((profit / p.selling_price) * 1000) / 10 : 0;
      return { ...p, cost_price: cost, profit_margin_amount: profit, profit_margin_percent: marginPct };
    }));
  }

  function generatePO() {
    const lines = lowStockItems.map((p) => `${p.product_name} (${p.net_quantity}) — reorder ${Math.max(20, p.reorder_threshold * 2 - p.available_stock)} units`).join("\n");
    const blob = new Blob([`RetailCore — Supplier Purchase Order\nGenerated: ${new Date().toLocaleString()}\n\n${lines}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "purchase_order.txt"; a.click();
    URL.revokeObjectURL(url);
    setToast({ tone: "green", msg: "Purchase order downloaded." });
  }

  /* ------------------- Theming shells ------------------- */
  const shell = dark ? "bg-[#081B33] text-slate-100" : "bg-[#F6F9FC] text-slate-900";
  const card = dark ? "bg-[#102A4E]/70 backdrop-blur-md ring-1 ring-white/10" : "bg-white ring-1 ring-slate-900/5";
  const inputCls = dark
    ? "bg-slate-800/70 border-slate-700 text-slate-100 placeholder-slate-500"
    : "bg-white border-slate-200 text-slate-900 placeholder-slate-400";

  const NAV = [
    { id: "dashboard", label: t.dashboard, icon: LayoutDashboard },
    { id: "pos", label: t.pos, icon: ScanBarcode },
    { id: "inventory", label: t.inventory, icon: Boxes },
    { id: "udhaar", label: t.udhaar, icon: BookUser },
    { id: "analytics", label: t.analytics, icon: LineChartIcon },
    { id: "settings", label: t.settings, icon: Settings },
  ];

  return (
    <div className={`min-h-screen w-full font-sans ${shell}`} style={{ fontFamily: "Inter, ui-sans-serif, system-ui" }}>
      <style>{`
        @keyframes pulseSoft { 0%,100%{opacity:1} 50%{opacity:.55} }
        .pulse-soft { animation: pulseSoft 1.8s ease-in-out infinite; }
        .glass { backdrop-filter: blur(12px); }
        ::-webkit-scrollbar { height: 8px; width: 8px; }
        ::-webkit-scrollbar-thumb { background: rgba(148,163,184,.4); border-radius: 8px; }
      `}</style>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className={`hidden md:flex flex-col w-60 shrink-0 border-r ${dark ? "border-white/10 bg-[#081B33]/70" : "border-slate-200 bg-white"} p-4`}>
          <div className="flex items-center gap-2 px-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0F2A52] to-[#2C5490] flex items-center justify-center text-white font-bold ring-2 ring-green-500/30">R</div>
            <div>
              <p className="font-bold leading-none" style={{ fontFamily: "Manrope, Inter, sans-serif" }}>RetailCore</p>
              <p className={`text-[11px] ${dark ? "text-slate-500" : "text-slate-400"}`}>Kirana Micro-ERP</p>
            </div>
          </div>
          <nav className="flex-1 space-y-1">
            {NAV.map((n) => {
              const active = activeTab === n.id;
              return (
                <button key={n.id} onClick={() => setActiveTab(n.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? "bg-gradient-to-r from-[#0F2A52] to-[#2C5490] text-white shadow-sm"
                      : dark ? "text-slate-300 hover:bg-white/5" : "text-slate-600 hover:bg-slate-100"
                  }`}>
                  <n.icon size={18} />
                  {n.label}
                  {n.id === "udhaar" && totalUdhaar > 0 && !active && (
                    <span className="ml-auto text-[10px] font-bold text-red-500">{customers.filter(c=>c.balance>0).length}</span>
                  )}
                </button>
              );
            })}
          </nav>
          <div className={`mt-4 rounded-xl p-3 text-xs ${dark ? "bg-white/5 text-slate-400" : "bg-slate-50 text-slate-500"}`}>
            <p className="font-semibold mb-1 flex items-center gap-1"><KeyRound size={12}/> {t.shortcuts}</p>
            <p>{t.billing}</p>
            <p>{t.customerSearch}</p>
          </div>
        </aside>

        {/* Main column */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Topbar */}
          <header className={`sticky top-0 z-20 flex items-center gap-3 px-4 sm:px-6 py-3 border-b glass ${dark ? "border-white/10 bg-[#081B33]/85" : "border-slate-200 bg-white/80"}`}>
            <span className="md:hidden font-bold text-green-600">RetailCore</span>
            <div className="flex-1" />
            <button onClick={() => setOnline((o) => !o)} className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${online ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"} ${dark && (online ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400")}`}>
              {online ? <Wifi size={13} /> : <WifiOff size={13} className="pulse-soft" />}
              {online ? t.online : `${t.offline} · ${queuedTxns} queued`}
            </button>
            <div className="relative">
              <select value={lang} onChange={(e) => setLang(e.target.value)}
                className={`appearance-none pl-7 pr-3 py-1.5 rounded-lg text-xs font-semibold border ${inputCls}`}>
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="mr">मराठी</option>
              </select>
              <Globe size={13} className={`absolute left-2 top-1/2 -translate-y-1/2 ${dark ? "text-slate-400" : "text-slate-500"}`} />
            </div>
            <button onClick={() => setDark((d) => !d)} className={`p-2 rounded-lg ${dark ? "bg-white/5 text-amber-300" : "bg-slate-100 text-slate-600"}`}>
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </header>

          {/* Live ledger strip — signature element */}
          <div className={`flex items-center gap-6 overflow-x-auto px-4 sm:px-6 py-2 text-xs font-semibold border-b ${dark ? "border-white/10 bg-[#0F2A52]/30 text-slate-300" : "border-slate-200 bg-[#EAF0F8] text-slate-600"}`}>
            <span className="flex items-center gap-1.5 shrink-0"><IndianRupee size={12} className="text-green-600"/> {t.todaysRevenue}: <b className="tabular-nums">{inr(todaysRevenue)}</b></span>
            <span className="flex items-center gap-1.5 shrink-0"><TrendingUp size={12} className="text-green-600"/> {t.todaysProfit}: <b className="tabular-nums">{inr(todaysProfit)}</b></span>
            <span className="flex items-center gap-1.5 shrink-0"><CreditCard size={12} className="text-amber-500"/> {t.cashInUdhaar}: <b className="tabular-nums">{inr(totalUdhaar)}</b></span>
            <span className="flex items-center gap-1.5 shrink-0"><PackageX size={12} className="text-red-500"/> {t.lowStock}: <b>{lowStockItems.length}</b></span>
            <span className="flex items-center gap-1.5 shrink-0"><CalendarClock size={12} className="text-red-500"/> {t.expiringSoon}: <b>{expiringItems.length}</b></span>
          </div>

          {/* Content */}
          <main className="flex-1 p-4 sm:p-6 pb-24 md:pb-6 overflow-y-auto">
            {activeTab === "dashboard" && (
              <DashboardTab {...{ t, dark, todaysRevenue, todaysProfit, totalUdhaar, projectedMonthly, hourlyData, categoryProfitData, PIE_COLORS, lowStockItems, expiringItems, setActiveTab, card }} />
            )}
            {activeTab === "pos" && (
              <POSTab {...{
                t, dark, card, inputCls, search, setSearch, listening, startVoice, filteredProducts, addToCart,
                cartLines, cartSubtotal, cartGst, cartTotal, cartProfit, changeQty, setQty, removeFromCart,
                customers, selectedCustomer, setSelectedCustomer, payMode, setPayMode, completeCheckout, showQR, setShowQR
              }} />
            )}
            {activeTab === "inventory" && (
              <InventoryTab {...{
                t, dark, card, inputCls, invCategory, setInvCategory, invFilter, setInvFilter, invSort, setInvSort,
                inventoryView, adjustStock, generatePO, lowStockItems,
                setStock, setExpiry, setReorderThreshold, setSellingPrice, setProfitPerPack
              }} />
            )}
            {activeTab === "udhaar" && (
              <UdhaarTab {...{
                t, dark, card, inputCls, customers, whatsappReminderLink, recordPayment,
                setCustomerBalance, setCustomerCreditLimit, setCustomerLastTxnDate, setCustomerTrust
              }} />
            )}
            {activeTab === "analytics" && (
              <AnalyticsTab {...{ t, dark, card, hourlyData, categoryProfitData, PIE_COLORS, topMoversData }} />
            )}
            {activeTab === "settings" && <SettingsTab {...{ t, dark, card, inputCls, lang, setLang, setDark }} />}
          </main>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className={`md:hidden fixed bottom-0 inset-x-0 z-30 flex items-center justify-around border-t glass ${dark ? "border-white/10 bg-[#081B33]/90" : "border-slate-200 bg-white/90"} py-2`}>
        {NAV.map((n) => {
          const active = activeTab === n.id;
          return (
            <button key={n.id} onClick={() => setActiveTab(n.id)} className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg ${active ? "text-green-600" : dark ? "text-slate-500" : "text-slate-400"}`}>
              <n.icon size={19} />
              <span className="text-[10px] font-medium">{n.label.split(" ")[0]}</span>
            </button>
          );
        })}
      </nav>

      {/* Receipt modal */}
      {showReceipt && (
        <Modal onClose={() => setShowReceipt(null)} dark={dark}>
          <div className="text-center mb-3">
            <CheckCircle2 className="mx-auto text-green-500 mb-1" size={36} />
            <p className="font-bold text-lg">{t.transactionComplete}</p>
          </div>
          <div className={`rounded-xl p-3 text-sm ${dark ? "bg-slate-800/60" : "bg-slate-50"}`}>
            {showReceipt.items.map((i, idx) => (
              <div key={idx} className="flex justify-between py-1">
                <span>{i.name} <span className="text-slate-400">×{i.qty}</span></span>
                <span className="tabular-nums">{inr(i.price * i.qty)}</span>
              </div>
            ))}
            <div className="border-t mt-2 pt-2 border-dashed border-slate-300 flex justify-between font-bold">
              <span>{t.total}</span><span className="tabular-nums">{inr(showReceipt.total)}</span>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => window.print()} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold ${dark ? "bg-white/10 text-slate-100" : "bg-slate-100 text-slate-700"}`}>
              <Printer size={15} /> {t.print}
            </button>
            <a href={whatsappReceiptLink(showReceipt)} target="_blank" rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold bg-green-600 text-white">
              <MessageCircle size={15} /> {t.whatsapp}
            </a>
          </div>
        </Modal>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl shadow-lg text-sm font-semibold text-white ${
          toast.tone === "green" ? "bg-green-600" : toast.tone === "red" ? "bg-red-600" : "bg-amber-500"
        }`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

function Modal({ children, onClose, dark }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-sm rounded-2xl p-5 shadow-2xl ${dark ? "bg-slate-900 text-slate-100 ring-1 ring-white/10" : "bg-white text-slate-900"}`}>
        <button onClick={onClose} className={`absolute mt-[-8px] ml-[-8px] p-1 rounded-full ${dark ? "text-slate-400" : "text-slate-400"}`}><X size={16} /></button>
        {children}
      </div>
    </div>
  );
}

/* ============================================================================
   DASHBOARD
   ========================================================================== */
function DashboardTab({ t, dark, todaysRevenue, todaysProfit, totalUdhaar, projectedMonthly, hourlyData, categoryProfitData, PIE_COLORS, lowStockItems, expiringItems, setActiveTab, card }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-[#0F2A52] via-[#1B3B6F] to-[#2C5490] text-white shadow-lg">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-green-500/10" />
        <div className="absolute right-16 bottom-[-40px] w-28 h-28 rounded-full bg-white/5" />
        <p className="text-xs font-semibold text-white/60 uppercase tracking-wide relative">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>
        <h1 className="text-xl sm:text-2xl font-bold mt-1 relative" style={{ fontFamily: "Manrope, sans-serif" }}>{greeting}, Ramesh 👋</h1>
        <p className="text-sm text-white/70 mt-1 relative">Your store is tracking <span className="text-green-400 font-semibold">{inr(todaysProfit)}</span> profit today, with <span className="text-amber-300 font-semibold">{inr(totalUdhaar)}</span> still out on Udhaar.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={IndianRupee} label={t.todaysRevenue} value={inr(todaysRevenue)} tone="green" dark={dark} />
        <StatCard icon={TrendingUp} label={t.todaysProfit} value={inr(todaysProfit)} tone="indigo" dark={dark} />
        <StatCard icon={CreditCard} label={t.cashInUdhaar} value={inr(totalUdhaar)} tone="amber" dark={dark} />
        <StatCard icon={LineChartIcon} label={t.projectedMonthly} value={inr(projectedMonthly)} tone="green" dark={dark} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className={`lg:col-span-2 rounded-2xl p-4 sm:p-5 ${card}`}>
          <p className="font-semibold mb-3" style={{ fontFamily: "Manrope, sans-serif" }}>{t.hourlySales}</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={hourlyData}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22C55E" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#334155" : "#e2e8f0"} vertical={false} />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: dark ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: dark ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => inr(v)} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              <Area type="monotone" dataKey="sales" stroke="#15803D" strokeWidth={2} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={`rounded-2xl p-4 sm:p-5 ${card}`}>
          <p className="font-semibold mb-3" style={{ fontFamily: "Manrope, sans-serif" }}>{t.categoryProfit}</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categoryProfitData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
                {categoryProfitData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => inr(v)} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <button onClick={() => setActiveTab("inventory")} className={`text-left rounded-2xl p-4 ${card} hover:ring-2 hover:ring-red-400 transition`}>
          <div className="flex items-center gap-2 text-red-500 font-semibold mb-2"><AlertTriangle size={16} /> {t.lowStock} ({lowStockItems.length})</div>
          <div className="space-y-1 text-sm">
            {lowStockItems.slice(0, 4).map((p) => (
              <div key={p.id} className="flex justify-between"><span className="truncate">{p.product_name}</span><span className="text-red-500 font-semibold shrink-0 ml-2">{p.available_stock} left</span></div>
            ))}
          </div>
        </button>
        <button onClick={() => setActiveTab("inventory")} className={`text-left rounded-2xl p-4 ${card} hover:ring-2 hover:ring-amber-400 transition`}>
          <div className="flex items-center gap-2 text-amber-500 font-semibold mb-2"><CalendarClock size={16} /> {t.expiringSoon} ({expiringItems.length})</div>
          <div className="space-y-1 text-sm">
            {expiringItems.slice(0, 4).map((p) => (
              <div key={p.id} className="flex justify-between"><span className="truncate">{p.product_name}</span><span className="text-amber-500 font-semibold shrink-0 ml-2">{daysUntil(p.expiry_date)}d</span></div>
            ))}
          </div>
        </button>
      </div>
    </div>
  );
}

/* ============================================================================
   POS
   ========================================================================== */
function POSTab({ t, dark, card, inputCls, search, setSearch, listening, startVoice, filteredProducts, addToCart,
  cartLines, cartSubtotal, cartGst, cartTotal, cartProfit, changeQty, setQty, removeFromCart,
  customers, selectedCustomer, setSelectedCustomer, payMode, setPayMode, completeCheckout, showQR, setShowQR }) {
  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-3">
        <div className="relative">
          <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${dark ? "text-slate-500" : "text-slate-400"}`} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.searchPlaceholder}
            className={`w-full pl-9 pr-24 py-3 rounded-xl border text-sm min-h-[48px] ${inputCls}`} />
          <button onClick={startVoice} className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold ${listening ? "bg-red-500 text-white pulse-soft" : "bg-[#0F2A52] text-white"}`}>
            <Mic size={13} /> {t.speak}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[65vh] overflow-y-auto pr-1">
          {filteredProducts.map((p) => (
            <button key={p.id} onClick={() => addToCart(p.id)} disabled={p.available_stock <= 0}
              className={`text-left rounded-xl p-3 min-h-[48px] ${card} ${p.available_stock <= 0 ? "opacity-40" : "hover:ring-2 hover:ring-green-400"} transition`}>
              <p className="text-xs font-semibold leading-tight line-clamp-2">{p.product_name}</p>
              <p className={`text-[11px] mt-0.5 ${dark ? "text-slate-400" : "text-slate-500"}`}>{p.local_name} · {p.net_quantity}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="font-bold text-green-600 tabular-nums">{inr(p.selling_price)}</span>
                <span className={`text-[10px] ${p.available_stock < p.reorder_threshold ? "text-red-500 font-semibold" : dark ? "text-slate-500" : "text-slate-400"}`}>{p.available_stock} {t.available}</span>
              </div>
            </button>
          ))}
          {filteredProducts.length === 0 && <p className={`col-span-full text-center py-8 text-sm ${dark ? "text-slate-500" : "text-slate-400"}`}>No matches.</p>}
        </div>
      </div>

      {/* Cart panel */}
      <div className={`rounded-2xl p-4 flex flex-col ${card} lg:sticky lg:top-24 h-fit`}>
        <p className="font-semibold mb-3 flex items-center gap-2" style={{ fontFamily: "Manrope, sans-serif" }}><ShoppingCart size={16} /> {t.cart} ({cartLines.length})</p>
        <div className="flex-1 space-y-2 max-h-[32vh] overflow-y-auto mb-3">
          {cartLines.length === 0 && <p className={`text-sm py-6 text-center ${dark ? "text-slate-500" : "text-slate-400"}`}>{t.empty}</p>}
          {cartLines.map((l) => (
            <div key={l.productId} className={`flex items-center gap-2 rounded-lg p-2 ${dark ? "bg-slate-800/50" : "bg-slate-50"}`}>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">{l.product.product_name}</p>
                <p className="text-[11px] text-green-600 font-semibold tabular-nums">{inr(l.product.selling_price * l.qty)}</p>
              </div>
              <button onClick={() => changeQty(l.productId, -1)} className={`w-7 h-7 rounded-full flex items-center justify-center ${dark ? "bg-slate-700" : "bg-white ring-1 ring-slate-200"}`}><Minus size={12} /></button>
              <input type="number" value={l.qty} onChange={(e) => setQty(l.productId, e.target.value)}
                className={`w-9 text-center text-xs font-bold tabular-nums rounded-md border px-0.5 py-1 ${dark ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-slate-200"}`} />
              <button onClick={() => changeQty(l.productId, 1)} className={`w-7 h-7 rounded-full flex items-center justify-center ${dark ? "bg-slate-700" : "bg-white ring-1 ring-slate-200"}`}><Plus size={12} /></button>
              <button onClick={() => removeFromCart(l.productId)} className="text-red-500 p-1"><Trash2 size={13} /></button>
            </div>
          ))}
        </div>

        <div className={`text-sm space-y-1 border-t pt-3 ${dark ? "border-white/10" : "border-slate-200"}`}>
          <div className="flex justify-between"><span className={dark ? "text-slate-400" : "text-slate-500"}>{t.subtotal}</span><span className="tabular-nums">{inr(cartSubtotal)}</span></div>
          <div className="flex justify-between"><span className={dark ? "text-slate-400" : "text-slate-500"}>{t.gst}</span><span className="tabular-nums">{inr(cartGst)}</span></div>
          <div className="flex justify-between"><span className={dark ? "text-slate-400" : "text-slate-500"}>{t.profit}</span><span className="tabular-nums text-green-600 font-semibold">{inr(cartProfit)}</span></div>
          <div className="flex justify-between font-bold text-base pt-1"><span>{t.total}</span><span className="tabular-nums">{inr(cartTotal)}</span></div>
        </div>

        {payMode === "credit" && (
          <select value={selectedCustomer?.id || ""} onChange={(e) => setSelectedCustomer(customers.find((c) => c.id === e.target.value) || null)}
            className={`mt-3 w-full px-3 py-2.5 rounded-lg text-sm border min-h-[44px] ${inputCls}`}>
            <option value="">{t.customers}…</option>
            {customers.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
          </select>
        )}

        <div className="grid grid-cols-3 gap-2 mt-3">
          {[["cash", t.cash, Wallet], ["upi", t.upi, QrCode], ["credit", t.credit, BookUser]].map(([id, label, Icon]) => (
            <button key={id} onClick={() => setPayMode(id)}
              className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-[11px] font-semibold min-h-[48px] ${
                payMode === id ? "bg-green-600 text-white" : dark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"
              }`}>
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        <button
          onClick={() => { if (payMode === "upi") setShowQR(true); else completeCheckout(); }}
          disabled={cartLines.length === 0}
          className="mt-3 w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#0F2A52] to-[#1B3B6F] disabled:opacity-40 min-h-[48px]">
          {t.checkout} · {inr(cartTotal)}
        </button>
      </div>

      {showQR && (
        <Modal onClose={() => setShowQR(false)} dark={dark}>
          <p className="text-center font-semibold mb-3">{t.upi} · {inr(cartTotal)}</p>
          <div className="flex justify-center mb-3">
            <PseudoQR seedText={`upi://pay?am=${cartTotal}&pn=RetailCore`} />
          </div>
          <p className={`text-center text-[11px] mb-3 ${dark ? "text-slate-500" : "text-slate-400"}`}>Simulated QR for demo — scan with any UPI app in production.</p>
          <button onClick={() => { setShowQR(false); completeCheckout(); }} className="w-full py-3 rounded-xl font-bold text-white bg-green-600">Mark as Paid</button>
        </Modal>
      )}
    </div>
  );
}

/* ============================================================================
   INVENTORY
   ========================================================================== */
function InventoryTab({ t, dark, card, inputCls, invCategory, setInvCategory, invFilter, setInvFilter, invSort, setInvSort, inventoryView, adjustStock, generatePO, lowStockItems, setStock, setExpiry, setReorderThreshold, setSellingPrice, setProfitPerPack }) {
  const cellInput = `text-xs font-semibold tabular-nums text-center rounded-md border px-1.5 py-1 ${inputCls}`;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <select value={invCategory} onChange={(e) => setInvCategory(e.target.value)} className={`px-3 py-2 rounded-lg text-sm border ${inputCls}`}>
          <option>All</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        {[["all", t.allItems], ["low", t.lowStock], ["expiring", t.expiringSoon], ["fast", t.fastMoving]].map(([id, label]) => (
          <button key={id} onClick={() => setInvFilter(id)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold ${invFilter === id ? "bg-green-600 text-white" : dark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
            {label}
          </button>
        ))}
        <select value={invSort} onChange={(e) => setInvSort(e.target.value)} className={`px-3 py-2 rounded-lg text-sm border ml-auto ${inputCls}`}>
          <option value="name">Sort: Name</option>
          <option value="margin">Sort: Margin %</option>
          <option value="stock">Sort: Stock</option>
        </select>
        <button onClick={generatePO} disabled={lowStockItems.length === 0}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-[#0F2A52] text-white disabled:opacity-40">
          <FileDown size={13} /> {t.reorder}
        </button>
      </div>
      <p className={`text-[11px] flex items-center gap-1 ${dark ? "text-slate-500" : "text-slate-400"}`}>
        <PackagePlus size={12} /> Price, profit/pack, stock, reorder point and expiry are all editable — click any field to update it live.
      </p>

      <div className={`rounded-2xl overflow-hidden ${card}`}>
        <div className="overflow-x-auto max-h-[65vh]">
          <table className="w-full text-sm">
            <thead className={`sticky top-0 text-xs uppercase tracking-wide ${dark ? "bg-slate-800/90 text-slate-400" : "bg-slate-50 text-slate-500"}`}>
              <tr>
                <th className="text-left px-3 py-2.5">{t.name}</th>
                <th className="text-left px-3 py-2.5 hidden sm:table-cell">{t.category}</th>
                <th className="text-center px-3 py-2.5">{t.price}</th>
                <th className="text-center px-3 py-2.5 hidden sm:table-cell">Profit/Pack</th>
                <th className="text-center px-3 py-2.5 hidden lg:table-cell">{t.margin}</th>
                <th className="text-center px-3 py-2.5">{t.stock}</th>
                <th className="text-center px-3 py-2.5 hidden lg:table-cell">Reorder At</th>
                <th className="text-center px-3 py-2.5 hidden md:table-cell">Expiry</th>
              </tr>
            </thead>
            <tbody>
              {inventoryView.map((p) => {
                const d = daysUntil(p.expiry_date);
                const low = p.available_stock < p.reorder_threshold;
                const expired = d < 0;
                return (
                  <tr key={p.id} className={`border-t ${dark ? "border-white/5" : "border-slate-100"}`}>
                    <td className="px-3 py-2.5">
                      <p className="font-medium">{p.product_name}</p>
                      <p className={`text-[11px] ${dark ? "text-slate-500" : "text-slate-400"}`}>{p.local_name} · {p.net_quantity}</p>
                    </td>
                    <td className="px-3 py-2.5 hidden sm:table-cell text-xs">{p.category}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center justify-center gap-1">
                        <span className={`text-[11px] ${dark ? "text-slate-500" : "text-slate-400"}`}>₹</span>
                        <input type="number" value={p.selling_price} onChange={(e) => setSellingPrice(p.id, e.target.value)}
                          className={`w-16 ${cellInput}`} />
                      </div>
                    </td>
                    <td className="px-3 py-2.5 hidden sm:table-cell">
                      <div className="flex items-center justify-center gap-1">
                        <span className={`text-[11px] ${dark ? "text-slate-500" : "text-slate-400"}`}>₹</span>
                        <input type="number" value={p.profit_margin_amount} onChange={(e) => setProfitPerPack(p.id, e.target.value)}
                          className={`w-14 ${cellInput} ${p.profit_margin_amount > 0 ? "text-green-600" : "text-red-500"}`} />
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-center hidden lg:table-cell">
                      <Pill tone={p.profit_margin_percent > 20 ? "green" : "amber"} dark={dark}>{p.profit_margin_percent}%</Pill>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => adjustStock(p.id, -1)} className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center ${dark ? "bg-slate-700" : "bg-slate-100"}`}><Minus size={11} /></button>
                        <input type="number" value={p.available_stock} onChange={(e) => setStock(p.id, e.target.value)}
                          className={`w-12 ${cellInput} ${low ? "text-red-500" : ""}`} />
                        <button onClick={() => adjustStock(p.id, 1)} className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center ${dark ? "bg-slate-700" : "bg-slate-100"}`}><Plus size={11} /></button>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-center hidden lg:table-cell">
                      <input type="number" value={p.reorder_threshold} onChange={(e) => setReorderThreshold(p.id, e.target.value)}
                        className={`w-12 ${cellInput}`} />
                    </td>
                    <td className="px-3 py-2.5 hidden md:table-cell text-center">
                      <div className="flex flex-col items-center gap-1">
                        <input type="date" value={p.expiry_date} onChange={(e) => setExpiry(p.id, e.target.value)}
                          className={`text-[11px] rounded-md border px-1.5 py-1 ${inputCls} ${expired ? "text-red-500 font-semibold" : d <= 30 ? "text-amber-500 font-semibold" : ""}`} />
                        {expired ? <Pill tone="red" dark={dark}>expired</Pill> : d <= 30 ? <Pill tone="amber" dark={dark}>{d}d left</Pill> : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   UDHAAR LEDGER
   ========================================================================== */
function UdhaarTab({ t, dark, card, inputCls, customers, whatsappReminderLink, recordPayment, setCustomerBalance, setCustomerCreditLimit, setCustomerLastTxnDate, setCustomerTrust }) {
  const [payingId, setPayingId] = useState(null);
  const [payAmt, setPayAmt] = useState("");
  const sorted = [...customers].sort((a, b) => b.balance - a.balance);
  const cellInput = `tabular-nums rounded-md border px-1.5 py-1 ${inputCls}`;

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-3">
        <StatCard icon={Users} label={t.customers} value={customers.length} tone="indigo" dark={dark} />
        <StatCard icon={CreditCard} label={t.cashInUdhaar} value={inr(customers.reduce((s, c) => s + c.balance, 0))} tone="amber" dark={dark} />
        <StatCard icon={AlertTriangle} label={t.overdue} value={customers.filter((c) => daysSince(c.lastTxnDate) > 30 && c.balance > 0).length} tone="red" dark={dark} />
      </div>
      <p className={`text-[11px] flex items-center gap-1 ${dark ? "text-slate-500" : "text-slate-400"}`}>
        <PackagePlus size={12} /> Balance, credit limit, trust rating and last-transaction date are all editable per customer.
      </p>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {sorted.map((c) => {
          const daysAgo = daysSince(c.lastTxnDate);
          const bucket = ageBucket(daysAgo);
          return (
            <div key={c.id} className={`rounded-2xl p-4 ${card}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{c.name}</p>
                  <p className={`text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>{c.phone}</p>
                </div>
                <span className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} onClick={() => setCustomerTrust(c.id, n)} className="text-amber-500">
                      <Star size={13} fill={n <= c.trust ? "currentColor" : "none"} />
                    </button>
                  ))}
                </span>
              </div>
              <div className="mt-3 flex items-end justify-between gap-2">
                <div>
                  <p className={`text-[11px] ${dark ? "text-slate-500" : "text-slate-400"}`}>{t.balance}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-bold" style={{ color: c.balance > 0 ? bucket.color : "#22C55E" }}>₹</span>
                    <input type="number" value={c.balance} onChange={(e) => setCustomerBalance(c.id, e.target.value)}
                      className="w-24 text-xl font-bold tabular-nums bg-transparent border-b border-dashed focus:outline-none"
                      style={{ color: c.balance > 0 ? bucket.color : "#22C55E", borderColor: dark ? "#334155" : "#cbd5e1" }} />
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-[11px] ${dark ? "text-slate-500" : "text-slate-400"}`}>Last txn</p>
                  <input type="date" value={c.lastTxnDate} onChange={(e) => setCustomerLastTxnDate(c.id, e.target.value)}
                    className={`text-[11px] ${cellInput}`} />
                </div>
              </div>
              <div className={`mt-2 h-1.5 rounded-full overflow-hidden ${dark ? "bg-slate-800" : "bg-slate-100"}`}>
                <div className="h-full rounded-full" style={{ width: `${Math.min(100, (c.balance / (c.creditLimit || 1)) * 100)}%`, background: bucket.color }} />
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <span className={`text-[11px] ${dark ? "text-slate-500" : "text-slate-400"}`}>{t.creditLimit}</span>
                <div className="flex items-center gap-1">
                  <span className={`text-[11px] ${dark ? "text-slate-500" : "text-slate-400"}`}>₹</span>
                  <input type="number" value={c.creditLimit} onChange={(e) => setCustomerCreditLimit(c.id, e.target.value)}
                    className={`w-20 text-[11px] ${cellInput}`} />
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <a href={whatsappReminderLink(c)} target="_blank" rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[11px] font-semibold bg-green-600 text-white">
                  <MessageCircle size={12} /> {t.sendReminder}
                </a>
                <button onClick={() => setPayingId(payingId === c.id ? null : c.id)}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[11px] font-semibold ${dark ? "bg-white/10 text-slate-100" : "bg-slate-100 text-slate-700"}`}>
                  <Wallet size={12} /> {t.recordPayment}
                </button>
              </div>
              {payingId === c.id && (
                <div className="flex gap-2 mt-2">
                  <input value={payAmt} onChange={(e) => setPayAmt(e.target.value)} type="number" placeholder="₹0"
                    className={`flex-1 px-2 py-1.5 rounded-lg text-xs border ${inputCls}`} />
                  <button onClick={() => { const amt = parseFloat(payAmt) || 0; if (amt > 0) { recordPayment(c.id, amt); setPayAmt(""); setPayingId(null); } }}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0F2A52] text-white">OK</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================================
   ANALYTICS
   ========================================================================== */
function AnalyticsTab({ t, dark, card, hourlyData, categoryProfitData, PIE_COLORS, topMoversData }) {
  return (
    <div className="space-y-4">
      <div className={`rounded-2xl p-4 sm:p-5 ${card}`}>
        <p className="font-semibold mb-3" style={{ fontFamily: "Manrope, sans-serif" }}>{t.hourlySales}</p>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#334155" : "#e2e8f0"} vertical={false} />
            <XAxis dataKey="hour" tick={{ fontSize: 11, fill: dark ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: dark ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v) => inr(v)} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
            <Area type="monotone" dataKey="sales" stroke="#0F2A52" fill="#0F2A52" fillOpacity={0.15} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className={`rounded-2xl p-4 sm:p-5 ${card}`}>
          <p className="font-semibold mb-3" style={{ fontFamily: "Manrope, sans-serif" }}>{t.categoryProfit}</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={categoryProfitData} dataKey="value" nameKey="name" outerRadius={95} label={({ name }) => name.split(" ")[0]}>
                {categoryProfitData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => inr(v)} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className={`rounded-2xl p-4 sm:p-5 ${card}`}>
          <p className="font-semibold mb-3" style={{ fontFamily: "Manrope, sans-serif" }}>{t.topMovers}</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topMoversData} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#334155" : "#e2e8f0"} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: dark ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 10, fill: dark ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                {topMoversData.map((d, i) => <Cell key={i} fill={d.type === "Fast" ? "#16A34A" : "#DC2626"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   SETTINGS
   ========================================================================== */
function SettingsTab({ t, dark, card, inputCls, lang, setLang, setDark }) {
  return (
    <div className="max-w-lg space-y-4">
      <div className={`rounded-2xl p-5 ${card}`}>
        <p className="font-semibold mb-3" style={{ fontFamily: "Manrope, sans-serif" }}>Store Profile</p>
        <label className="block text-xs font-semibold mb-1">{t.storeName}</label>
        <input defaultValue="Sharma General Store" className={`w-full px-3 py-2.5 rounded-lg border text-sm mb-3 ${inputCls}`} />
        <label className="block text-xs font-semibold mb-1">{t.ownerName}</label>
        <input defaultValue="Ramesh Sharma" className={`w-full px-3 py-2.5 rounded-lg border text-sm ${inputCls}`} />
      </div>
      <div className={`rounded-2xl p-5 ${card} flex items-center justify-between`}>
        <div className="flex items-center gap-2"><Moon size={16} /> {t.darkMode}</div>
        <button onClick={() => setDark((d) => !d)} className={`w-11 h-6 rounded-full relative transition ${dark ? "bg-green-600" : "bg-slate-300"}`}>
          <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition ${dark ? "left-5" : "left-0.5"}`} />
        </button>
      </div>
      <div className={`rounded-2xl p-5 ${card}`}>
        <p className="font-semibold mb-3 flex items-center gap-2"><Globe size={16}/> {t.language}</p>
        <div className="flex gap-2">
          {[["en", "English"], ["hi", "हिंदी"], ["mr", "मराठी"]].map(([id, label]) => (
            <button key={id} onClick={() => setLang(id)} className={`px-3 py-2 rounded-lg text-sm font-semibold ${lang === id ? "bg-green-600 text-white" : dark ? "bg-slate-800" : "bg-slate-100"}`}>{label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
