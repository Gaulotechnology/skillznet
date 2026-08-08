with open("src/pages/dashboard/shared/DashboardHelpSupportPage.tsx", "r") as f:
    content = f.read()

content = content.replace('href="mailto:${supportInfo.email}"', 'href={`mailto:${supportInfo.email}`}')

with open("src/pages/dashboard/shared/DashboardHelpSupportPage.tsx", "w") as f:
    f.write(content)
