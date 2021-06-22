from brownie import accounts,Fonds,Client,Promoteur


def main():
    """ Simple deploy script for our two contracts. """
    accounts[0].deploy(Fonds)
    accounts[0].deploy(Client)
    accounts[0].deploy(Promoteur)
