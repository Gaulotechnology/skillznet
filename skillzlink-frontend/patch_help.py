import re

with open("src/pages/dashboard/shared/DashboardHelpSupportPage.tsx", "r") as f:
    content = f.read()

# Add publicApi import
content = content.replace('import { accountApi } from "../../../services/api";', 'import { accountApi, publicApi } from "../../../services/api";\nimport { useEffect } from "react";')

# Add state and useEffect inside the component
state_code = """
  const [supportInfo, setSupportInfo] = useState({
    email: "support@skillzlink.com",
    phone: "+263 123 456 789",
    hours: "Monday to Friday, 8am - 5pm CAT."
  });

  useEffect(() => {
    publicApi.getThemeSettings().then(res => {
      if (res.settings) {
        setSupportInfo(prev => ({
          email: res.settings.email || prev.email,
          phone: res.settings.phone || res.settings.whatsapp || prev.phone,
          hours: prev.hours // Default hours since we don't have this in admin settings yet
        }));
      }
    }).catch(console.error);
  }, []);
"""

content = content.replace("  const [ticketToast, setTicketToast]", state_code + "\n  const [ticketToast, setTicketToast]")

# Replace hardcoded values in JSX
content = content.replace("Our support team is available Monday to Friday, 8am - 5pm CAT.", "Our support team is available {supportInfo.hours}")
content = content.replace("mailto:support@skillzlink.com", 'mailto:${supportInfo.email}')
content = content.replace(">support@skillzlink.com<", ">{supportInfo.email}<")
content = content.replace('href="tel:+263123456789"', 'href={`tel:${supportInfo.phone}`}')
content = content.replace(">+263 123 456 789<", ">{supportInfo.phone}<")

with open("src/pages/dashboard/shared/DashboardHelpSupportPage.tsx", "w") as f:
    f.write(content)
