<div class="row">
    <div class="col-md-8">

        <div class="form-group">
            <h4><?php echo erTranslationClassLhTranslation::getInstance()->getTranslation('module/infobip','Infobip WhatsApp configuration')?></h4>
            <p class="text-muted"><?php echo erTranslationClassLhTranslation::getInstance()->getTranslation('module/infobip','Configure the Infobip sender number and API endpoint used for WhatsApp messaging.')?></p>
        </div>

        <?php if ($saved === true) : ?>
            <div class="alert alert-success" role="alert"><?php echo erTranslationClassLhTranslation::getInstance()->getTranslation('module/infobip','Settings saved')?></div>
        <?php endif; ?>

        <?php if (!empty($errors)) : ?>
            <?php foreach ($errors as $error) : ?>
                <div class="alert alert-danger" role="alert"><?php echo htmlspecialchars($error)?></div>
            <?php endforeach; ?>
        <?php endif; ?>

        <form method="post" action="<?php echo erLhcoreClassDesign::baseurl('infobip/index')?>">
            <input type="hidden" name="store_infobip" value="1" />

            <div class="form-group">
                <label><?php echo erTranslationClassLhTranslation::getInstance()->getTranslation('module/infobip','Sender number (WhatsApp)')?></label>
                <input type="text" class="form-control" name="sender_number" value="<?php echo htmlspecialchars($item->sender_number)?>" placeholder="27780179816" />
                <small class="form-text text-muted"><?php echo erTranslationClassLhTranslation::getInstance()->getTranslation('module/infobip','International format without +')?></small>
            </div>

            <div class="form-group">
                <label><?php echo erTranslationClassLhTranslation::getInstance()->getTranslation('module/infobip','API base URL')?></label>
                <input type="text" class="form-control" name="base_url" value="<?php echo htmlspecialchars($item->base_url)?>" placeholder="x1l2r4.api.infobip.com" />
            </div>

            <div class="form-group">
                <label><?php echo erTranslationClassLhTranslation::getInstance()->getTranslation('module/infobip','API key')?></label>
                <input type="text" class="form-control" name="api_key" value="<?php echo htmlspecialchars($item->api_key)?>" />
            </div>

            <div class="form-group">
                <label><?php echo erTranslationClassLhTranslation::getInstance()->getTranslation('module/infobip','Generic bot ID')?></label>
                <input type="number" class="form-control" name="bot_id" value="<?php echo (int)$item->bot_id?>" />
            </div>

            <div class="form-group">
                <label><?php echo erTranslationClassLhTranslation::getInstance()->getTranslation('module/infobip','Department ID (0 = first department)')?></label>
                <input type="number" class="form-control" name="dep_id" value="<?php echo (int)$item->dep_id?>" />
            </div>

            <div class="form-group">
                <label><?php echo erTranslationClassLhTranslation::getInstance()->getTranslation('module/infobip','Chat reuse timeout (seconds)')?></label>
                <input type="number" class="form-control" name="chat_timeout" value="<?php echo (int)$item->chat_timeout?>" />
            </div>

            <div class="form-group form-check">
                <input type="checkbox" class="form-check-input" id="debug" name="debug" value="1" <?php if ((int)$item->debug === 1) : ?>checked="checked"<?php endif; ?> />
                <label class="form-check-label" for="debug"><?php echo erTranslationClassLhTranslation::getInstance()->getTranslation('module/infobip','Enable debug logging')?></label>
            </div>

            <button type="submit" class="btn btn-secondary"><?php echo erTranslationClassLhTranslation::getInstance()->getTranslation('module/infobip','Save')?></button>
        </form>
    </div>

    <div class="col-md-4">
        <div class="form-group">
            <h4><?php echo erTranslationClassLhTranslation::getInstance()->getTranslation('module/infobip','Inbound webhook')?></h4>
            <p class="text-muted"><?php echo erTranslationClassLhTranslation::getInstance()->getTranslation('module/infobip','Configure this URL in the Infobip portal to receive incoming WhatsApp messages.')?></p>
            <div class="input-group">
                <input type="text" class="form-control" readonly="readonly" value="<?php echo htmlspecialchars($callbackUrl)?>" />
            </div>
        </div>
    </div>
</div>
