# Thandani-Ntuli_ST10530267_MAST5112
Chef's Menu Manager is a mobile application designed for restaurant chefs to easily digitize and manage their daily menu offerings.



Changes Implemented from part 2 to part 3

From the first version to the second version of the application, significant enhancements were made to meet the full POE requirements. The initial implementation only supported adding and viewing menu items on a single screen. The second version introduces a three-screen navigation system implemented using useState with ActiveScreen type ('stats' | 'manage' | 'search') and a custom tab bar. A Dashboard/Statistics screen was added that calculates and displays total dishes, average price using reduce(), and a breakdown count per course. Full CRUD functionality was implemented by extending handleAddDish into handleSaveDish to support both create and update operations, supported by an editingId state, along with handleEditItem and handleDeleteItem functions with user confirmation. Additionally, a dedicated Search and Filter screen was implemented using searchQuery and selectedFilterCourse states to filter the menu by name and course category, including a clear filters function and a dynamic results count. These changes improved the user experience, code modularity, and ensured the app meets the POE criteria for menu management, statistics, and search functionality.
