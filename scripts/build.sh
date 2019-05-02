#!/bin/bash

# ============================  Script Variables   ============================
SOURCE_FOLDER="../src"
PUBLIC_FOLDER="../public"

# =============================================================================

timestampString() {
  date +"%Y-%m-%d %T"
}

log() {
  echo "$(timestampString): $1"
}

# =============================================================================

log "================================================================================"
log "BART Watch - Build is starting"
log "================================================================================"

log ">> Removing prev. build."
rm -rf $PUBLIC_FOLDER

log ">> Creating build folder."
mkdir -p $PUBLIC_FOLDER

log ">> building bart.gariany.com"
cp -R $SOURCE_FOLDER/* $PUBLIC_FOLDER/

log "================================================================================"
log ">> Done!"
log "================================================================================"
log ""
log ">> Public build is in: $PUBLIC_FOLDER"
log ""
