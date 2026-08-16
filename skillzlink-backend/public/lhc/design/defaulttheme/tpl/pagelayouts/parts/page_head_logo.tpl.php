<a ng-non-bindable rel="noreferrer" class="back-logo d-flex align-items-center gap-2 text-decoration-none" href="<?php if (isset($Result['theme']) !== false && $Result['theme']->widget_copyright_url != '') : ?><?php echo htmlspecialchars($Result['theme']->widget_copyright_url) ?><?php else : ?><?php echo erLhcoreClassModelChatConfig::fetch('customer_site_url')->current_value?><?php endif;?>" target="_blank" title="SkillzNet">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24" fill="none">
    <rect x="0" y="0" width="32" height="32" rx="8" fill="#0F172A"/>
    <path d="M10 10 C 10 7, 22 6, 22 10 C 22 13, 10 13, 10 17" fill="none" stroke="#00A843" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M11 13 C 14 12, 19 12, 21 16 C 22.5 18, 22.5 21, 22.5 24" fill="none" stroke="#FFD600" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M22 17 C 22 21, 10 21, 10 24 C 10 27, 22 27, 22 24" fill="none" stroke="#EF4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="9.5" cy="10" r="1.5" fill="#FFFFFF"/>
    <circle cx="22.5" cy="24" r="1.5" fill="#FFFFFF"/>
    <circle cx="16" cy="16" r="1.2" fill="#FFFFFF"/>
  </svg>
  <span style="font-weight:700;font-size:14px;color:inherit;letter-spacing:-0.2px;">Skillz<span style="color:#00A843;">N</span><span style="color:#FFD600;">e</span><span style="color:#EF4444;">t</span></span>
</a>
