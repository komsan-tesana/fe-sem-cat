export const menuItems = [
  { key: "/", label: "Home", show: false },
  { key: "/auth", label: "Auth", show: false },
  { key: "/products/:id", label: "Products Detail", show: false },

  //Common Show
  { key: "/search", label: "Find a Cat", show: true },
  { key: "/favorites", label: "Favorites", show: true },
  {
    label: "Checkout",
    key: "/checkout",
    show: false,
  },
  { key: "/virtualAdopt", label: "Virtual Adopt", show: false },
  { key: "/successStories", label: "Success Stories", show: true },

  // Admin
  {
    key: "admin",
    label: "Admin Menu",
    show: true,
    admin: true,
    children: [
      {
        label: "Dash Board",
        key: "/admin/dash-board",
        show: true,
      },
      {
        label: "Users",
        key: "/admin/users",
        show: true,
      },
    ],
  },
];
