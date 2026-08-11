<a ng-non-bindable rel="noreferrer" class="back-logo d-flex align-items-center gap-2 text-decoration-none" href="<?php if (isset($Result['theme']) !== false && $Result['theme']->widget_copyright_url != '') : ?><?php echo htmlspecialchars($Result['theme']->widget_copyright_url) ?><?php else : ?><?php echo erLhcoreClassModelChatConfig::fetch('customer_site_url')->current_value?><?php endif;?>" target="_blank" title="SkillzLink">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24" fill="none">
    <circle cx="16" cy="16" r="15" fill="#7c3aed"/>
    <circle cx="10" cy="10" r="4" fill="white" opacity="0.9"/>
    <circle cx="22" cy="22" r="4" fill="white" opacity="0.9"/>
    <line x1="13" y1="13" x2="19" y2="19" stroke="white" stroke-width="2.5" stroke-linecap="round" opacity="0.9"/>
    <circle cx="16" cy="16" r="1.5" fill="#a78bfa"/>
  </svg>
  <span style="font-weight:600;font-size:14px;color:inherit;">SkillzLink</span>
</a>
