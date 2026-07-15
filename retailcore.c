/******************************************************************************
 * Project: RetailCore - Hyperlocal Micro-ERP
 * Lead Architect: Harshad Kaldate | MIT-WPU
 * Description: Inventory management and billing system for retail shops
 *****************************************************************************/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

// --- CONFIGURATION ---
#define MAX_ITEMS 5000
#define DB_FILE "C:/Users/HP/Desktop/My Projects/C language/projectdata.csv" 
#define LOW_STOCK_THRESHOLD 15.0

// --- DATA STRUCTURES ---
typedef struct {
    int id;
    char name[60];
    char category[30];
    float price;
    float stock;       
    char unit[10];     
} Product;

Product inventory[MAX_ITEMS];
int itemCount = 0;

// --- UTILITY FUNCTIONS ---
void clearInputBuffer() {
    int c;
    while ((c = getchar()) != '\n' && c != EOF);
}

void printCurrentDate() {
    time_t t = time(NULL);
    struct tm tm = *localtime(&t);
    printf("Date: %02d-%02d-%d\n", tm.tm_mday, tm.tm_mon + 1, tm.tm_year + 1900);
}

// --- FILE HANDLING MODULE ---
void loadDatabase() {
    FILE *fp = fopen(DB_FILE, "r");
    if (!fp) {
        printf("\n[SYSTEM] Warning: %s not found. Starting fresh.\n", DB_FILE);
        return;
    }

    char buffer[256];
    fgets(buffer, sizeof(buffer), fp); // Skip Header

    itemCount = 0;
    while (fgets(buffer, sizeof(buffer), fp)) {
        Product p;
        if (sscanf(buffer, "%d,%[^,],%[^,],%f,%f,%[^,\n\r]", 
                   &p.id, p.name, p.category, &p.price, &p.stock, p.unit) == 6) {
            inventory[itemCount++] = p;
        }
    }
    fclose(fp);
    printf("[SYSTEM] Initialization: %d records synchronized.\n", itemCount);
}

void saveDatabase() {
    FILE *fp = fopen(DB_FILE, "w");
    if (!fp) {
        printf("\n[ERROR] Could not save database! Ensure CSV is closed.\n");
        return;
    }
    fprintf(fp, "ID,Name,Category,Price,Stock,Unit\n");
    for (int i = 0; i < itemCount; i++) {
        fprintf(fp, "%d,%s,%s,%.2f,%.2f,%s\n", 
                inventory[i].id, inventory[i].name, inventory[i].category, 
                inventory[i].price, inventory[i].stock, inventory[i].unit);
    }
    fclose(fp);
}

// --- CORE LOGIC MODULES ---

int findProductIndex(int id) {
    for (int i = 0; i < itemCount; i++) {
        if (inventory[i].id == id) return i;
    }
    return -1;
}

void processBilling() {
    int id;
    float qty;
    float totalBill = 0.0;
    char choice;
    int itemsInBill = 0;

    do {
        printf("\n>> Scan Item ID: ");
        if (scanf("%d", &id) != 1) {
            clearInputBuffer();
            printf("   [!] Invalid Input.\n");
            continue;
        }

        int idx = findProductIndex(id);
        if (idx == -1) {
            printf("   [!] Item ID %d not found.\n", id);
        } else {
            printf("   FOUND: %s (%s)\n", inventory[idx].name, inventory[idx].category);
            printf("   Price: Rs. %.2f | Available: %.2f %s\n", 
                   inventory[idx].price, inventory[idx].stock, inventory[idx].unit);
            
            printf("   >> Enter Quantity: ");
            scanf("%f", &qty);

            if (qty > inventory[idx].stock) {
                printf("   [!] Insufficient stock!\n");
            } else {
                totalBill += (qty * inventory[idx].price);
                inventory[idx].stock -= qty; 
                itemsInBill++;
                printf("   [+] Added: Rs. %.2f\n", qty * inventory[idx].price);
                printf("   [i] Remaining Stock: %.2f %s\n", inventory[idx].stock, inventory[idx].unit);
            }
        }
        printf("\n>> Add another item? (y/n): ");
        clearInputBuffer();
        scanf("%c", &choice);
    } while (choice == 'y' || choice == 'Y');

    if (itemsInBill > 0) {
        printf("\n************** BILL SUMMARY **************\n");
        printf(" Total Items: %d\n", itemsInBill);
        printf(" GRAND TOTAL: Rs. %.2f\n", totalBill);
        printf("******************************************\n");
        saveDatabase(); 
    }
}

void viewInventory() {
    printf("\n=== INVENTORY SNIPPET ===\n");
    printf("Total Items in Database: %d\n", itemCount);
    printf("--------------------------------------------------------------------------\n");
    int limit = (itemCount < 10) ? itemCount : 10;
    for (int i = 0; i < limit; i++) {
        printf("%-6d %-30s %-10.2f %-8.2f %s\n", 
               inventory[i].id, inventory[i].name, inventory[i].price, inventory[i].stock, inventory[i].unit);
    }
    printf("--------------------------------------------------------------------------\n");
}

void generateLowStockAudit() {
    printf("\n=== [!] DUKAN ALERT: LOW STOCK REPORT ===\n");
    int alertCount = 0;
    for (int i = 0; i < itemCount; i++) {
        if (inventory[i].stock < LOW_STOCK_THRESHOLD) {
            printf("ID: %-5d | %-25s | Stock: %.2f %s\n", 
                   inventory[i].id, inventory[i].name, inventory[i].stock, inventory[i].unit);
            alertCount++;
        }
    }
    if (alertCount == 0) printf("All inventory levels are healthy.\n");
}

void searchItem() {
    int searchId;
    printf("\n>> Enter ID to Search: ");
    scanf("%d", &searchId);
    int idx = findProductIndex(searchId);
    if (idx != -1) {
        printf("\nMatch Found: %s | Price: %.2f | Stock: %.2f %s\n", 
               inventory[idx].name, inventory[idx].price, inventory[idx].stock, inventory[idx].unit);
    } else printf("   [!] ID %d not found.\n", searchId);
}

void restockItem() {
    int id;
    float addQty;
    printf("\n--- RESTOCK MODULE ---\nEnter ID: ");
    scanf("%d", &id);
    int idx = findProductIndex(id);
    if (idx != -1) {
        printf("Enter Quantity to Add: ");
        scanf("%f", &addQty);
        inventory[idx].stock += addQty;
        printf("[SUCCESS] Stock Updated.\n");
        saveDatabase();
    } else printf("[!] Item not found.\n");
}

// --- MAIN INTERFACE ---
int main() {
    loadDatabase();
    int choice;
    while (1) {
        printf("\n /----------------------------------\\\n");
        printf(" |    RETAILCORE - MAIN MENU        |\n");
        printf(" \\----------------------------------/\n");
        printf(" | 1. New Billing Transaction       |\n");
        printf(" | 2. View Inventory Snippet        |\n");
        printf(" | 3. Run Low Stock Audit           |\n");
        printf(" | 4. Search Item by ID             |\n");
        printf(" | 5. Restock / Update Inventory    |\n");
        printf(" | 6. Exit System                   |\n");
        printf(" ------------------------------------\n");
        printf(" Select Option: ");
        if (scanf("%d", &choice) != 1) { clearInputBuffer(); continue; }
        switch (choice) {
            case 1: processBilling(); break; 
            case 2: viewInventory(); break;
            case 3: generateLowStockAudit(); break;
            case 4: searchItem(); break; 
            case 5: restockItem(); break;
            case 6: saveDatabase(); exit(0);
        }
    }
    return 0;
}