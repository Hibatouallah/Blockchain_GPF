from brownie import accounts,Promoteur


def main():
    """ Simple deploy script for our two contracts. """
    accounts[0].deploy(Promoteur)
   
