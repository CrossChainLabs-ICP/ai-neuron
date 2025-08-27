# The bot to deploy
BOT=ai-neuron-ocbot

# Get the OpenChat public key
OC_PUBLIC_KEY=$(curl -s https://oc.app/public-key)

if [ $? -ne 0 ]; then
    echo "Unable to get the OpenChat public key."
    exit 1
fi

# Deploy the bot
dfx deploy $BOT --argument "(\"$OC_PUBLIC_KEY\")" || exit 1
#dfx canister install --quiet --mode reinstall $BOT --argument "(\"$OC_PUBLIC_KEY\")" || exit 1

# Get the canister ID
CANISTER_ID=$(dfx canister id $BOT) || exit 1

echo ""
echo "Principal: $CANISTER_ID"
echo "Endpoint: http://$CANISTER_ID.raw.localhost:4943"
echo ""
