# The bot to deploy
BOT=ai-neuron-ocbot

# Get the OpenChat public key
OC_PUBLIC_KEY=$(curl -s https://oc.app/public-key)

if [ $? -ne 0 ]; then
    echo "Unable to get the OpenChat public key."
    exit 1
fi

# Deploy the bot
dfx deploy $BOT --argument "(\"$OC_PUBLIC_KEY\")" --network ic|| exit 1
#dfx canister install --quiet --mode reinstall $BOT --argument "(\"$OC_PUBLIC_KEY\")" --network ic|| exit 1

# Get the canister ID
CANISTER_ID=$(dfx canister id $BOT --network ic) || exit 1

echo ""
echo "Principal: $CANISTER_ID"
echo "Endpoint: https://$CANISTER_ID.raw.icp0.io"
echo ""

#https://rofg5-eaaaa-aaaau-abykq-cai.raw.icp0.io