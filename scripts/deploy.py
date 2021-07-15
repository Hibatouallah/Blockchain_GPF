from brownie import accounts,Fonds,Client,Promoteur,EngagementClient,EngagamentPromoteur


def main():
    """ Simple deploy script for our two contracts. """
    accounts[0].deploy(Fonds)
    accounts[0].deploy(Client)
    accounts[0].deploy(Promoteur)
    accounts[0].deploy(EngagementClient)
    accounts[0].deploy(EngagamentPromoteur)
