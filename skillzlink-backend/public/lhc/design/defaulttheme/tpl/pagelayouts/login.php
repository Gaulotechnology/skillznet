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
			<span><a href="<?php echo erLhcoreClassDesign::baseurl()?>" title="SkillzLink" class="d-flex align-items-center gap-2 text-decoration-none">
			  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none">
			    <circle cx="16" cy="16" r="15" fill="#7c3aed"/>
			    <circle cx="10" cy="10" r="4" fill="white" opacity="0.9"/>
			    <circle cx="22" cy="22" r="4" fill="white" opacity="0.9"/>
			    <line x1="13" y1="13" x2="19" y2="19" stroke="white" stroke-width="2.5" stroke-linecap="round" opacity="0.9"/>
			    <circle cx="16" cy="16" r="1.5" fill="#a78bfa"/>
			  </svg>
			  <span style="font-weight:700;font-size:18px;color:#1a1a2e;">SkillzLink</span>
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