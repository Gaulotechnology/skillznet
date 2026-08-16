<!DOCTYPE html>

<html lang="<?php echo erConfigClassLhConfig::getInstance()->getOverrideValue('site','content_language')?>" dir="<?php echo erConfigClassLhConfig::getInstance()->getOverrideValue('site','dir_language')?>">
<head>
<?php include_once(erLhcoreClassDesign::designtpl('pagelayouts/parts/page_head.tpl.php'));?>
</head>
<body>

<div class="modal d-block" tabindex="-1" role="dialog">
<div class="modal-dialog<?php isset($Result['modal_size']) ? print ' ' . $Result['modal_size'] : ''?>">
	<div class="modal-content">
		<div class="modal-header">
			<span><a href="<?php echo erLhcoreClassDesign::baseurl()?>" title="SkillzNet" class="d-flex align-items-center gap-2 text-decoration-none">
			  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none">
			    <rect x="0" y="0" width="32" height="32" rx="8" fill="#0F172A"/>
			    <path d="M10 10 C 10 7, 22 6, 22 10 C 22 13, 10 13, 10 17" fill="none" stroke="#00A843" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
			    <path d="M11 13 C 14 12, 19 12, 21 16 C 22.5 18, 22.5 21, 22.5 24" fill="none" stroke="#FFD600" stroke-width="2.5" stroke-linecap="round"/>
			    <path d="M22 17 C 22 21, 10 21, 10 24 C 10 27, 22 27, 22 24" fill="none" stroke="#EF4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
			    <circle cx="9.5" cy="10" r="1.5" fill="#FFFFFF"/>
			    <circle cx="22.5" cy="24" r="1.5" fill="#FFFFFF"/>
			    <circle cx="16" cy="16" r="1.2" fill="#FFFFFF"/>
			  </svg>
			  <span style="font-weight:800;font-size:18px;color:#0F172A;letter-spacing:-0.3px;">Skillz<span style="color:#00A843;">N</span><span style="color:#FFD600;">e</span><span style="color:#EF4444;">t</span></span>
			</a></span>
		</div>
		<div class="modal-body">
                <?php echo $Result['content'];?>
        </div>
	</div>
</div>
</div>


<div class="container-fluid">
<?php include_once(erLhcoreClassDesign::designtpl('pagelayouts/parts/page_footer.tpl.php'));?>
</div>

<?php if (erConfigClassLhConfig::getInstance()->getSetting( 'site', 'debug_output' ) == true) {
    $debug = ezcDebug::getInstance();
    echo "<div><pre class='bg-light text-dark m-2 p-2 border'>" . json_encode(erLhcoreClassUser::$permissionsChecks, JSON_PRETTY_PRINT) . "</pre></div>";
    echo $debug->generateOutput();
} ?>
</body>
</html>